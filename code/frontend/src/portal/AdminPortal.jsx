import { useEffect, useState } from "react";
import { LuCalendarClock, LuCheck, LuFileText, LuPencil, LuPlus, LuRefreshCcw, LuTrash2, LuUsers, LuWrench, LuX } from "react-icons/lu";
import { T } from "../styles/theme";
import { Badge, Button, Card, Field, Modal, PStat, PTable, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { createItem, createNews, createPerson, createUser, deleteItem, deleteNews, deletePerson, deleteUser, getBookings, getItems, getNews, getPeople, getUsers, updateBookingStatus, updateItem, updateNews, updatePerson, updateUser } from "../services/api";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function fmtDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
}

function isPending(status) {
  return String(status || "").toLowerCase() === "pending";
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value === "available") return "Active";
  if (value === "in-use" || value === "maintenance") return "Pending";
  if (value === "approved") return "Active";
  if (value === "rejected") return "Rejected";
  if (value === "pending") return "Pending";
  return "Pending";
}

function SectionFrame({ title, description, actions, children }) {
  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <SectionLabel text="Technical officer" />
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

function ConfirmModal({ title, message, confirmLabel = "Delete", confirmTone = "danger", onConfirm, onCancel, busy, error }) {
  return (
    <Modal title={title} subtitle={message} onClose={onCancel} maxWidth={460}>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button variant={confirmTone} icon={LuTrash2} onClick={onConfirm} disabled={busy}>{busy ? "Deleting…" : confirmLabel}</Button>
      </div>
    </Modal>
  );
}

function BookingStatusBadge({ status }) {
  return <Badge label={status || "Pending"} tone={isPending(status) ? "Pending" : String(status).toLowerCase() === "approved" ? "Active" : "Rejected"} />;
}

function OverviewSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ reservations: 0, equipment: 0, users: 0, people: 0, news: 0 });
  const [pendingReservations, setPendingReservations] = useState([]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingsRes, itemsRes, usersRes, peopleRes, newsRes] = await Promise.allSettled([
        getBookings(),
        getItems(),
        getUsers(),
        getPeople(),
        getNews(),
      ]);

      const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value.data : [];
      const items = itemsRes.status === "fulfilled" ? itemsRes.value.data : [];
      const users = usersRes.status === "fulfilled" ? usersRes.value.data : [];
      const people = peopleRes.status === "fulfilled" ? peopleRes.value.data : [];
      const news = newsRes.status === "fulfilled" ? newsRes.value.data : [];

      setStats({
        reservations: bookings.filter((booking) => isPending(booking.status)).length,
        equipment: items.length,
        users: users.length,
        people: people.length,
        news: news.length,
      });
      setPendingReservations(
        bookings
          .filter((booking) => isPending(booking.status))
          .slice(0, 4)
          .map((booking) => ({
            id: booking.id,
            user: booking.user_name || booking.name || booking.user || "Student",
            resource: booking.resource,
            date: booking.booking_date || booking.date,
            time: booking.time_slot || booking.time,
          }))
      );

      const failed = [bookingsRes, itemsRes, usersRes, peopleRes, newsRes].filter((result) => result.status === "rejected");
      if (failed.length > 0) setError("One or more dashboard feeds failed to load. Counts shown may be partial.");
    } catch (err) {
      console.error("Failed to load overview", err);
      setError(err.response?.data?.message || "Failed to load dashboard overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cards = [
    { label: "Pending reservations", value: stats.reservations, icon: LuCalendarClock, color: T.warning },
    { label: "Equipment items", value: stats.equipment, icon: LuWrench, color: T.navy },
    { label: "Users", value: stats.users, icon: LuUsers, color: T.success },
    { label: "People entries", value: stats.people, icon: LuUsers, color: T.navyLight },
    { label: "News posts", value: stats.news, icon: LuFileText, color: T.gold },
  ];

  return (
    <SectionFrame
      title="Overview"
      description="A live snapshot of the public directory, content feeds, equipment inventory, and booking queue."
      actions={<Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button>}
    >
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.warning}10`, border: `1px solid ${T.warning}26`, color: T.warning, fontSize: ".84rem" }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        {cards.map((card) => <PStat key={card.label} label={card.label} value={loading ? "—" : card.value} icon={card.icon} color={card.color} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Card style={{ padding: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Quick summary</div>
              <div style={{ color: T.navyDark, fontWeight: 700, marginTop: ".3rem" }}>Recent pending reservations</div>
            </div>
            <LuCalendarClock size={18} color={T.navy} />
          </div>
          {pendingReservations.length === 0 ? (
            <EmptyState title="No pending reservations" desc="The queue is currently clear." />
          ) : (
            <div style={{ display: "grid", gap: ".7rem" }}>
              {pendingReservations.map((reservation) => (
                <div key={reservation.id} style={{ padding: ".8rem .9rem", borderRadius: 14, border: `1px solid ${T.border}`, background: T.surfaceAlt }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: ".35rem" }}>
                    <div style={{ fontWeight: 700, color: T.navyDark }}>{reservation.user}</div>
                    <BookingStatusBadge status="Pending" />
                  </div>
                  <div style={{ color: T.textMid, fontSize: ".84rem", lineHeight: 1.6 }}>{reservation.resource}</div>
                  <div style={{ color: T.textLight, fontSize: ".77rem", marginTop: ".3rem" }}>{fmtDate(reservation.date)} · {reservation.time || "—"}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card style={{ padding: "1.1rem" }}>
          <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".9rem" }}>Notes</div>
          <div style={{ display: "grid", gap: ".8rem" }}>
            {[
              ["Bookings", "Approve or reject equipment reservations from the live queue."],
              ["People", "Add staff and students to the public directory."],
              ["News", "Publish lab announcements visible on the public site."],
              ["Users", "Manage portal accounts and password resets."],
            ].map(([title, desc]) => (
              <div key={title} style={{ padding: ".8rem .9rem", borderRadius: 14, background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
                <div style={{ fontWeight: 700, color: T.navyDark, marginBottom: ".25rem" }}>{title}</div>
                <div style={{ color: T.textMid, fontSize: ".84rem", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SectionFrame>
  );
}

function ReservationsSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getBookings();
      setRows(response.data || []);
    } catch (err) {
      console.error("Failed to load reservations", err);
      setError(err.response?.data?.message || "Failed to load reservations.");
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
      console.error("Failed to update reservation", err);
      setError(err.response?.data?.message || "Failed to update reservation status.");
    } finally {
      setActionId(null);
    }
  };

  const tableRows = rows.map((booking) => [
    `#${booking.id}`,
    booking.user_name || booking.name || booking.user || "Student",
    booking.resource,
    fmtDate(booking.booking_date || booking.date),
    booking.time_slot || booking.time || "—",
    <BookingStatusBadge key={`status-${booking.id}`} status={booking.status} />,
    booking.status === "Pending" ? (
      <div key={`actions-${booking.id}`} style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
        <Button variant="primary" size="sm" icon={LuCheck} onClick={() => handleAction(booking.id, "Approved")} disabled={actionId === booking.id}>Approve</Button>
        <Button variant="danger" size="sm" icon={LuX} onClick={() => handleAction(booking.id, "Rejected")} disabled={actionId === booking.id}>Reject</Button>
      </div>
    ) : (
      <span key={`done-${booking.id}`} style={{ color: T.textLight, fontSize: ".8rem" }}>Processed</span>
    ),
  ]);

  return (
    <SectionFrame
      title="Reservations"
      description="Review equipment bookings and process approval decisions."
      actions={<Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button>}
    >
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      {loading ? (
        <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading reservations…</Card>
      ) : rows.length === 0 ? (
        <EmptyState title="No reservations" desc="There are no booking requests in the system yet." />
      ) : (
        <PTable cols={["ID", "User", "Resource", "Date", "Time", "Status", "Actions"]} rows={tableRows} />
      )}
    </SectionFrame>
  );
}

function EquipmentModal({ open, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({ name: "", category: "", description: "", spec: "", fee: "", status: "available" });
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
      const payload = { ...form };
      if (isEdit) await updateItem(initial.id, payload);
      else await createItem(payload);
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
    <Modal title={isEdit ? "Edit equipment" : "Add equipment"} subtitle="Manage the public-facing inventory record." onClose={onClose} maxWidth={620}>
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

  const tableRows = rows.map((item) => [
    <strong key={`name-${item.id}`}>{item.name}</strong>,
    item.category,
    item.description,
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
      description="Manage the inventory shown in the administration workflow."
      actions={<div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button><Button variant="primary" icon={LuPlus} onClick={openAdd}>Add equipment</Button></div>}
    >
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      {loading ? <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading equipment…</Card> : rows.length === 0 ? <EmptyState title="No equipment records" desc="Add an item to begin managing the inventory." /> : <PTable cols={["Name", "Category", "Description", "Spec", "Fee", "Status", "Actions"]} rows={tableRows} />}
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

function UserModal({ open, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ name: initial?.name || "", email: initial?.email || "", password: "", role: initial?.role || "student" });
      setError("");
      setSaving(false);
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.email || (!isEdit && !form.password)) {
      setError("Name, email, and password are required for new users.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      if (isEdit) await updateUser(initial.id, payload);
      else await createUser({ ...payload, password: form.password });
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save user", err);
      setError(err.response?.data?.message || "Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit user" : "Add user"} subtitle="Manage portal accounts." onClose={onClose} maxWidth={560}>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <Field label="Name" value={form.name} onChange={set("name")} />
      <Field label="Email" type="email" value={form.email} onChange={set("email")} />
      <Field label={isEdit ? "Password (leave blank to keep unchanged)" : "Password"} type="password" value={form.password} onChange={set("password")} />
      <Field label="Role" value={form.role} onChange={set("role")} options={[
        { value: "student", label: "Student" },
        { value: "staff", label: "Staff" },
        { value: "professor", label: "Professor" },
        { value: "officer", label: "Officer" },
        { value: "admin", label: "Admin" },
      ]} />
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" icon={LuPlus} onClick={submit} disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Add user"}</Button>
      </div>
    </Modal>
  );
}

function UsersSection() {
  const currentUser = getStoredUser();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getUsers();
      setRows(response.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (user) => { setEditing(user); setModalOpen(true); };

  const requestDelete = (user) => {
    setDeleteTarget(user);
    setConfirmError("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setConfirmBusy(true);
    setConfirmError("");
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error("Failed to delete user", err);
      setConfirmError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setConfirmBusy(false);
    }
  };

  const tableRows = rows.map((user) => {
    const isSelf = currentUser?.id === user.id;
    return [
      user.id,
      user.name,
      user.email,
      <Badge key={`role-${user.id}`} label={user.role} tone={user.role === "officer" || user.role === "admin" ? "Active" : "Pending"} />,
      <div key={`actions-${user.id}`} style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
        <Button variant="outline" size="sm" icon={LuPencil} onClick={() => openEdit(user)}>Edit</Button>
        <Button variant="danger" size="sm" icon={LuTrash2} onClick={() => requestDelete(user)} disabled={isSelf}>Delete</Button>
      </div>,
    ];
  });

  return (
    <SectionFrame
      title="Users"
      description="Create and maintain portal accounts. Passwords are never displayed back in responses."
      actions={<div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button><Button variant="primary" icon={LuPlus} onClick={openAdd}>Add user</Button></div>}
    >
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      {loading ? <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading users…</Card> : rows.length === 0 ? <EmptyState title="No users" desc="Create the first portal account from here." /> : <PTable cols={["ID", "Name", "Email", "Role", "Actions"]} rows={tableRows} />}
      <UserModal open={modalOpen} initial={editing} onClose={() => setModalOpen(false)} onSaved={load} />
      {deleteTarget && !((currentUser?.id || null) === deleteTarget.id) && (
        <ConfirmModal
          title={`Delete user: ${deleteTarget.name}`}
          message="This account will be removed from the portal."
          confirmLabel="Delete user"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={confirmBusy}
          error={confirmError}
        />
      )}
    </SectionFrame>
  );
}

function PeopleModal({ open, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({ name: "", title: "", dept: "", research: "", type: "staff", sort_order: "0" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        title: initial?.title || "",
        dept: initial?.dept || "",
        research: initial?.research || "",
        type: initial?.type || "staff",
        sort_order: String(initial?.sort_order ?? 0),
      });
      setSaving(false);
      setError("");
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.title || !form.dept || !form.research) {
      setError("Please complete all fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, sort_order: Number(form.sort_order || 0) };
      if (isEdit) await updatePerson(initial.id, payload);
      else await createPerson(payload);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save person", err);
      setError(err.response?.data?.message || "Failed to save person.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit staff / person" : "Add staff / person"} subtitle="Update the public people directory." onClose={onClose} maxWidth={620}>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
        <Field label="Name" value={form.name} onChange={set("name")} />
        <Field label="Title / role" value={form.title} onChange={set("title")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
        <Field label="Department" value={form.dept} onChange={set("dept")} />
        <Field label="Type" value={form.type} onChange={set("type")} options={[{ value: "staff", label: "Staff" }, { value: "student", label: "Student" }]} />
      </div>
      <Field label="Research focus" value={form.research} onChange={set("research")} />
      <Field label="Sort order" type="number" value={form.sort_order} onChange={set("sort_order")} />
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" icon={LuPlus} onClick={submit} disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Add person"}</Button>
      </div>
    </Modal>
  );
}

function PeopleSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getPeople();
      setRows((response.data || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || (a.id - b.id)));
    } catch (err) {
      console.error("Failed to load people", err);
      setError(err.response?.data?.message || "Failed to load people.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (person) => { setEditing(person); setModalOpen(true); };
  const requestDelete = (person) => { setDeleteTarget(person); setConfirmError(""); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setConfirmBusy(true);
    setConfirmError("");
    try {
      await deletePerson(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error("Failed to delete person", err);
      setConfirmError(err.response?.data?.message || "Failed to delete person.");
    } finally {
      setConfirmBusy(false);
    }
  };

  const tableRows = rows.map((person) => [
    person.name,
    person.title,
    person.dept,
    person.research,
    person.type,
    person.sort_order,
    <div key={`actions-${person.id}`} style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
      <Button variant="outline" size="sm" icon={LuPencil} onClick={() => openEdit(person)}>Edit</Button>
      <Button variant="danger" size="sm" icon={LuTrash2} onClick={() => requestDelete(person)}>Delete</Button>
    </div>,
  ]);

  return (
    <SectionFrame
      title="Staff & People"
      description="Manage the public directory shown on the People page."
      actions={<div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button><Button variant="primary" icon={LuPlus} onClick={openAdd}>Add person</Button></div>}
    >
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      {loading ? <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading people…</Card> : rows.length === 0 ? <EmptyState title="No people records" desc="Add a staff member or student profile to populate the public directory." /> : <PTable cols={["Name", "Title", "Department", "Research", "Type", "Order", "Actions"]} rows={tableRows} />}
      <PeopleModal open={modalOpen} initial={editing} onClose={() => setModalOpen(false)} onSaved={load} />
      {deleteTarget && (
        <ConfirmModal
          title={`Delete directory entry: ${deleteTarget.name}`}
          message="This entry will be removed from the public People page."
          confirmLabel="Delete person"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={confirmBusy}
          error={confirmError}
        />
      )}
    </SectionFrame>
  );
}

function NewsModal({ open, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({ category: "", title: "", content: "", published_date: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        category: initial?.category || "",
        title: initial?.title || "",
        content: initial?.content || "",
        published_date: initial?.published_date ? String(initial.published_date).slice(0, 10) : "",
      });
      setSaving(false);
      setError("");
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    if (!form.category || !form.title || !form.content) {
      setError("Please complete all fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (isEdit) await updateNews(initial.id, payload);
      else await createNews(payload);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save news", err);
      setError(err.response?.data?.message || "Failed to save news.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit news" : "Add news"} subtitle="Publish updates to the public news feed." onClose={onClose} maxWidth={620}>
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
        <Field label="Category" value={form.category} onChange={set("category")} />
        <Field label="Published date" type="date" value={form.published_date} onChange={set("published_date")} />
      </div>
      <Field label="Title" value={form.title} onChange={set("title")} />
      <Field label="Content" value={form.content} onChange={set("content")} rows={5} />
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="primary" icon={LuPlus} onClick={submit} disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Add news"}</Button>
      </div>
    </Modal>
  );
}

function NewsSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getNews();
      setRows((response.data || []).slice().sort((a, b) => new Date(b.published_date || 0) - new Date(a.published_date || 0) || (b.id - a.id)));
    } catch (err) {
      console.error("Failed to load news", err);
      setError(err.response?.data?.message || "Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (news) => { setEditing(news); setModalOpen(true); };
  const requestDelete = (news) => { setDeleteTarget(news); setConfirmError(""); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setConfirmBusy(true);
    setConfirmError("");
    try {
      await deleteNews(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error("Failed to delete news", err);
      setConfirmError(err.response?.data?.message || "Failed to delete news.");
    } finally {
      setConfirmBusy(false);
    }
  };

  const tableRows = rows.map((news) => [
    news.category,
    news.title,
    news.content,
    fmtDate(news.published_date),
    <div key={`actions-${news.id}`} style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
      <Button variant="outline" size="sm" icon={LuPencil} onClick={() => openEdit(news)}>Edit</Button>
      <Button variant="danger" size="sm" icon={LuTrash2} onClick={() => requestDelete(news)}>Delete</Button>
    </div>,
  ]);

  return (
    <SectionFrame
      title="News"
      description="Publish announcements, achievements, and events for the public site."
      actions={<div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button><Button variant="primary" icon={LuPlus} onClick={openAdd}>Add news</Button></div>}
    >
      {error && <div style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      {loading ? <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading news…</Card> : rows.length === 0 ? <EmptyState title="No news posts" desc="Add a lab announcement or event to populate the news feed." /> : <PTable cols={["Category", "Title", "Content", "Published", "Actions"]} rows={tableRows} />}
      <NewsModal open={modalOpen} initial={editing} onClose={() => setModalOpen(false)} onSaved={load} />
      {deleteTarget && (
        <ConfirmModal
          title={`Delete news post: ${deleteTarget.title}`}
          message="This post will disappear from the public news page."
          confirmLabel="Delete news"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={confirmBusy}
          error={confirmError}
        />
      )}
    </SectionFrame>
  );
}

export function AdminPortal({ active }) {
  if (active === "overview") return <OverviewSection />;
  if (active === "reservations") return <ReservationsSection />;
  if (active === "equipment") return <EquipmentSection />;
  if (active === "users") return <UsersSection />;
  if (active === "people") return <PeopleSection />;
  if (active === "news") return <NewsSection />;
  return <OverviewSection />;
}
