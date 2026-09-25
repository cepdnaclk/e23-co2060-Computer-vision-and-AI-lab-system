import { Statistics } from "./Statistics";
import { IssueReportsSection } from "./IssueReportsSection";
import { useEffect, useState } from "react";
import {
  LuCheck, LuPencil, LuPlus, LuRefreshCcw, LuTrash2,
  LuWrench, LuCalendarClock, LuX, LuShieldCheck, LuCalendarDays
} from "react-icons/lu";
import { T } from "../styles/theme";
import { Badge, Button, Card, Field, Modal, PStat, PTable, Divider, SectionLabel, SectionTitle } from "../components/UI";
import {
  getBookings, updateBookingStatus,
  getItems, createItem, updateItem, deleteItem
} from "../services/api";

// ─── Helpers ────────────────────────────────────────────────────
function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
}

function isPending(status) {
  return String(status || "").toLowerCase() === "pending";
}

function normalizeStatus(status) {
  const v = String(status || "").toLowerCase();
  if (v === "available") return "Active";
  if (v === "approved") return "Active";
  if (v === "rejected") return "Rejected";
  return "Pending";
}

// ─── Shared UI pieces ───────────────────────────────────────────
function SectionFrame({ title, description, actions, children }) {
  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <SectionLabel text="Technical Officer" />
          <SectionTitle>{title}</SectionTitle>
          <Divider />
          {description && <p style={{ margin: 0, maxWidth: 780, color: T.textMid, lineHeight: 1.8, fontSize: ".94rem" }}>{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <Card style={{ padding: "1.4rem", textAlign: "center", background: T.surfaceAlt }}>
      <div style={{ fontWeight: 700, color: T.navyDark, marginBottom: ".35rem" }}>{title}</div>
      <div style={{ color: T.textMid, fontSize: ".88rem", lineHeight: 1.65 }}>{desc}</div>
    </Card>
  );
}

function ConfirmModal({ title, message, confirmLabel = "Delete", onConfirm, onCancel, busy, error }) {
  return (
    <Modal title={title} subtitle={message} onClose={onCancel} maxWidth={460}>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button variant="danger" icon={LuTrash2} onClick={onConfirm} disabled={busy}>{busy ? "Deleting…" : confirmLabel}</Button>
      </div>
    </Modal>
  );
}

function RescheduleModal({ open, booking, onClose, onSaved }) {
  const [form, setForm] = useState({ booking_date: "", time_slot: "", admin_notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && booking) {
      setForm({
        booking_date: booking.booking_date ? String(booking.booking_date).slice(0, 10) : "",
        time_slot: booking.time_slot || "",
        admin_notes: booking.admin_notes || ""
      });
      setSaving(false);
      setError("");
    }
  }, [open, booking]);

  if (!open || !booking) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    if (!form.booking_date || !form.time_slot) {
      setError("Please provide a new date and time slot.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateBookingStatus(booking.id, {
        status: "Rescheduled",
        booking_date: form.booking_date,
        time_slot: form.time_slot,
        admin_notes: form.admin_notes
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to reschedule", err);
      setError(err.response?.data?.message || "Failed to reschedule booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Reschedule Reservation" subtitle={`Update date and time for reservation #${booking.id}`} onClose={onClose} maxWidth={500}>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <Field label="New Date" type="date" value={form.booking_date} onChange={set("booking_date")} />
      <Field label="New Time Slot" value={form.time_slot} onChange={set("time_slot")} options={["08:00–10:00", "10:00–12:00", "13:00–15:00", "15:00–17:00", "17:00–19:00"]} />
      <Field label="Admin Notes / Reason" value={form.admin_notes} onChange={set("admin_notes")} rows={3} placeholder="Provide a reason for rescheduling..." />
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" icon={LuCalendarDays} onClick={submit} disabled={saving}>{saving ? "Saving…" : "Reschedule"}</Button>
      </div>
    </Modal>
  );
}

// ─── Booking Requests Section ───────────────────────────────────
function BookingRequestsSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getBookings();
      setRows(response.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setError(err.response?.data?.message || "Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, status) => {
    setActionId(id);
    setError("");
    try {
      await updateBookingStatus(id, { status });
      await load();
    } catch (err) {
      console.error("Failed to update booking", err);
      setError(err.response?.data?.message || "Failed to update booking status.");
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = rows.filter(b => isPending(b.status)).length;

  const tableRows = rows.map((booking) => [
    `#${booking.id}`,
    booking.user_name || "Student",
    booking.user_email || "—",
    booking.purpose || "—",
    booking.resource,
    fmtDate(booking.booking_date || booking.date),
    booking.time_slot || booking.time || "—",
    <Badge
      key={`status-${booking.id}`}
      label={booking.status || "Pending"}
      tone={isPending(booking.status) ? "Pending" : String(booking.status).toLowerCase() === "approved" ? "Active" : booking.status === "Rescheduled" ? "Rescheduled" : "Rejected"}
    />,
    ["pending", "rescheduled"].includes(String(booking.status).toLowerCase()) ? (
      <div key={`act-${booking.id}`} style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
        <Button variant="primary" size="sm" icon={LuCheck} onClick={() => handleAction(booking.id, "Approved")} disabled={actionId === booking.id}>Approve</Button>
        <Button variant="outline" size="sm" icon={LuCalendarDays} onClick={() => setRescheduleTarget(booking)} disabled={actionId === booking.id}>Reschedule</Button>
        <Button variant="danger" size="sm" icon={LuX} onClick={() => handleAction(booking.id, "Rejected")} disabled={actionId === booking.id}>Reject</Button>
      </div>
    ) : (
      <span key={`done-${booking.id}`} style={{ color: T.textLight, fontSize: ".8rem" }}>Processed</span>
    ),
  ]);

  return (
    <SectionFrame
      title="Booking Requests"
      description={`Review and process student equipment booking requests. ${pendingCount > 0 ? `${pendingCount} pending approval.` : "No pending requests."}`}
      actions={<Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button>}
    >
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <PStat icon={LuCalendarClock} label="Pending" value={loading ? "—" : rows.filter(b => isPending(b.status)).length} color={T.warning} />
        <PStat icon={LuCheck} label="Approved" value={loading ? "—" : rows.filter(b => String(b.status).toLowerCase() === "approved").length} color={T.success} />
        <PStat icon={LuX} label="Rejected" value={loading ? "—" : rows.filter(b => String(b.status).toLowerCase() === "rejected").length} color={T.danger} />
      </div>
      {loading ? (
        <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading booking requests…</Card>
      ) : rows.length === 0 ? (
        <EmptyState title="No booking requests" desc="No students have submitted booking requests yet." />
      ) : (
        <PTable cols={["ID", "Student", "Email", "Purpose", "Resource", "Date", "Time", "Status", "Actions"]} rows={tableRows} />
      )}
      <RescheduleModal open={!!rescheduleTarget} booking={rescheduleTarget} onClose={() => setRescheduleTarget(null)} onSaved={load} />
    </SectionFrame>
  );
}

// ─── Equipment Management Section ──────────────────────────────
function EquipmentModal({ open, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({ name: "", category: "", description: "", spec: "", fee: "", status: "available", image_url: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        category: initial?.category || "",
        description: initial?.description || "",
        spec: initial?.spec || "",
        fee: initial?.fee || "",
        status: initial?.status || "available",
        image_url: initial?.image_url || ""
      });
      setError("");
      setSaving(false);
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.category) {
      setError("Name and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) await updateItem(initial.id, form);
      else await createItem(form);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save equipment", err);
      setError(err.response?.data?.message || "Failed to save equipment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit equipment" : "Add equipment"} subtitle="Manage the lab inventory." onClose={onClose} maxWidth={620}>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
        <Field label="Name" value={form.name} onChange={set("name")} />
        <Field label="Category" value={form.category} onChange={set("category")} />
      </div>
      <Field label="Description" value={form.description} onChange={set("description")} rows={3} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
        <Field label="Spec" value={form.spec} onChange={set("spec")} />
        <Field label="Fee" value={form.fee} onChange={set("fee")} />
      </div>
      <Field label="Image URL" value={form.image_url} onChange={set("image_url")} placeholder="Optional media URL..." />
      <Field label="Status" value={form.status} onChange={set("status")} options={[
        { value: "available", label: "Available" },
        { value: "in-use", label: "In use" },
        { value: "maintenance", label: "Maintenance" },
      ]} />
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" icon={LuPlus} onClick={submit} disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Add equipment"}</Button>
      </div>
    </Modal>
  );
}

function EquipmentSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmError, setConfirmError] = useState("");
  const [confirmBusy, setConfirmBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getItems();
      setRows(response.data || []);
    } catch (err) {
      console.error("Failed to load equipment", err);
      setError(err.response?.data?.message || "Failed to load equipment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setModalOpen(true); };

  const requestDelete = (item) => {
    setDeleteTarget(item);
    setConfirmError("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setConfirmBusy(true);
    setConfirmError("");
    try {
      await deleteItem(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error("Failed to delete equipment", err);
      setConfirmError(err.response?.data?.message || "Failed to delete equipment.");
    } finally {
      setConfirmBusy(false);
    }
  };

  const availableCount = rows.filter(r => r.status === "available").length;
  const inUseCount = rows.filter(r => r.status === "in-use").length;
  const maintCount = rows.filter(r => r.status === "maintenance").length;

  const tableRows = rows.map((item) => [
    <strong key={`name-${item.id}`}>{item.name}</strong>,
    item.category,
    item.description || "—",
    item.spec || "—",
    item.fee || "—",
    <Badge key={`status-${item.id}`} label={item.status} tone={normalizeStatus(item.status)} />,
    <div key={`actions-${item.id}`} style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
      <Button variant="outline" size="sm" icon={LuPencil} onClick={() => openEdit(item)}>Edit</Button>
      <Button variant="danger" size="sm" icon={LuTrash2} onClick={() => requestDelete(item)}>Delete</Button>
    </div>,
  ]);

  return (
    <SectionFrame
      title="Equipment"
      description="Manage lab equipment inventory. Add new items, update status, and remove decommissioned equipment."
      actions={
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button>
          <Button variant="primary" icon={LuPlus} onClick={openAdd}>Add equipment</Button>
        </div>
      }
    >
      {/* Status summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <PStat icon={LuWrench} label="Available" value={loading ? "—" : availableCount} color={T.success} />
        <PStat icon={LuWrench} label="In Use" value={loading ? "—" : inUseCount} color={T.warning} />
        <PStat icon={LuWrench} label="Maintenance" value={loading ? "—" : maintCount} color={T.danger} />
      </div>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      {loading ? (
        <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading equipment…</Card>
      ) : rows.length === 0 ? (
        <EmptyState title="No equipment records" desc="Add a lab item to begin managing the inventory." />
      ) : (
        <PTable cols={["Name", "Category", "Description", "Spec", "Fee", "Status", "Actions"]} rows={tableRows} />
      )}
      <EquipmentModal open={modalOpen} initial={editing} onClose={() => setModalOpen(false)} onSaved={load} />
      {deleteTarget && (
        <ConfirmModal
          title={`Delete equipment: ${deleteTarget.name}`}
          message="This removes the inventory record permanently."
          confirmLabel="Delete equipment"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={confirmBusy}
          error={confirmError}
        />
      )}
    </SectionFrame>
  );
}

// ─── Export ─────────────────────────────────────────────────────
export function OfficerPortal({ active }) {
  if (active === "overview") return <Statistics />;
  if (active === "equipment") return <EquipmentSection />;
  if (active === "issues") return <IssueReportsSection />;
  return <BookingRequestsSection />;  // default to booking-requests
}
