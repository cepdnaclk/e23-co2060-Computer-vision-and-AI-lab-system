import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LuCamera, LuClock3, LuQrCode, LuUpload, LuDownload, LuFileText, LuTriangleAlert } from "react-icons/lu";
import { T } from "../styles/theme";
import { Badge, Button, Card, Field, PTable } from "../components/UI";
import { getItems, createBooking, getMyBookings, getNews, getUnavailableSlots, createIssueReport, getIssueReports } from "../services/api";
import { bookingsToCSV, bookingQRUrl } from "../utils/bookingExport";

function QRPassModal({ booking, onClose }) {
  if (!booking) return null;
  return createPortal(
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-shell" style={{ width: "min(100%, 420px)" }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Lab access pass</h3>
            <div className="modal-subtitle">Scan this code at the lab entrance.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <div style={{ border: `1px solid ${T.border}`, padding: "1rem", borderRadius: 18, display: "inline-block", marginBottom: "1rem" }}>
            <img src={bookingQRUrl(booking)} alt="QR code" />
          </div>
          <Card style={{ textAlign: "left", padding: "1rem", marginBottom: "1rem", background: T.surfaceAlt }}>
            <div><strong>ID:</strong> R-{booking.id}</div>
            <div><strong>Resource:</strong> {booking.resource}</div>
            <div><strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</div>
            <div><strong>Time:</strong> {booking.time_slot}</div>
          </Card>
          <Button variant="primary" fullWidth onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}


function BookingForm() {
  const ALL_SLOTS = ["08:00–10:00", "10:00–12:00", "13:00–15:00", "15:00–17:00"];
  const [options, setOptions] = useState(["High Performance Server", "Training Run (A100)", "Consultation - CV Methodology", "Lab Space Access"]);
  const [form, setForm] = useState({ resource: "", date: "", time: "", purpose: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState("");
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const todayStr = new Date().toLocaleDateString("en-CA"); 

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await getItems();
        const dbItems = response.data.map((item) => item.name);
        setOptions([...new Set([...dbItems, "High Performance Server", "Training Run (A100)", "Consultation - CV Methodology", "Lab Space Access"])]);
      } catch (error) {
        console.error("Failed to fetch dynamic resources:", error);
      }
    };
    fetchResources();
  }, []);

  // Fetch unavailable slots whenever resource or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!form.resource || !form.date) {
        setUnavailableSlots([]);
        return;
      }
      setLoadingSlots(true);
      try {
        const response = await getUnavailableSlots(form.resource, form.date);
        setUnavailableSlots(response.data || []);
        // If the currently selected time is now unavailable, clear it
        if (form.time && (response.data || []).includes(form.time)) {
          setForm(prev => ({ ...prev, time: "" }));
        }
      } catch (error) {
        console.error("Failed to fetch unavailable slots:", error);
        setUnavailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [form.resource, form.date]);

  const set = (key) => (e) => setForm((value) => ({ ...value, [key]: e.target.value }));

  const handleDateChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, date: val }));

    if (!val) { setDateError(""); return; }

    const [year, month, day] = val.split("-").map(Number);
    const picked = new Date(year, month - 1, day); 
    const dayOfWeek = picked.getDay(); 

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setDateError("Weekends (Saturday & Sunday) are not available for booking. Please choose a weekday.");
    } else {
      setDateError("");
    }
  };

  const handleSubmit = async () => {
    if (!form.resource || !form.date || !form.time || !form.purpose.trim()) {
      alert("Please select a resource, date, and time slot, and enter a purpose.");
      return;
    }
    if (dateError) {
      alert("Please select a valid weekday date.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createBooking({ requestType: "General Booking", resource: form.resource, date: form.date, time: form.time, purpose: form.purpose });
      alert("Success! Your booking request has been submitted for admin approval.");
      setForm({ resource: "", date: "", time: "", purpose: "" });
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Failed to submit the booking request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build time slot options with grayed-out unavailable ones
  const timeSlotOptions = ALL_SLOTS.map(slot => ({
    value: slot,
    label: unavailableSlots.includes(slot) ? `${slot} — Booked` : slot,
    disabled: unavailableSlots.includes(slot),
  }));

  return (
    <div className="fade-up">
      <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: ".35rem" }}>Resource booking request</h2>
      <p style={{ color: T.textLight, fontSize: ".9rem", marginBottom: "1.2rem" }}>Submit your request. All bookings are subject to staff or admin approval.</p>
      <Card style={{ padding: "1.25rem", maxWidth: 560 }}>
        <Field label="Resource / type" value={form.resource} onChange={set("resource")} options={options} icon={LuCamera} />
        <Field
          label="Preferred date"
          type="date"
          value={form.date}
          onChange={handleDateChange}
          icon={LuClock3}
          min={todayStr}
          error={dateError}
          helperText="Monday – Friday only. Weekends are unavailable."
        />
        <Field label="Time slot" value={form.time} onChange={set("time")} options={timeSlotOptions} icon={LuClock3} />
        {loadingSlots && <div style={{ color: T.textLight, fontSize: ".8rem", marginBottom: ".5rem" }}>Checking availability…</div>}
        {unavailableSlots.length > 0 && !loadingSlots && (
          <div style={{ color: T.gold, fontSize: ".8rem", marginBottom: ".5rem" }}>
            ⚠ {unavailableSlots.length} time slot{unavailableSlots.length > 1 ? "s" : ""} already booked for this resource on this date.
          </div>
        )}
        <Field label="Purpose / notes" rows={3} value={form.purpose} onChange={set("purpose")} placeholder="Describe your intended use..." />
        <Button variant="primary" icon={LuUpload} fullWidth onClick={handleSubmit} disabled={isSubmitting || !!dateError}>{isSubmitting ? "Submitting…" : "Submit request"}</Button>
      </Card>
    </div>
  );
}


function UsageHistory() {
  const [history, setHistory] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings();
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to load bookings", error);
        setError("Your bookings could not be loaded. Please reopen this page to retry.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const downloadCSV = () => {
    if (history.length === 0) return;
    const csvContent = bookingsToCSV(history);

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "my_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.15rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark }}>My bookings</h2>
        <Button variant="outline" size="sm" icon={LuDownload} onClick={downloadCSV} disabled={loading || !!error || history.length === 0}>Download CSV</Button>
      </div>
      <Field label="Filter bookings" value={filter} onChange={e => setFilter(e.target.value)} options={["All", "Pending", "Approved", "Rejected", "Rescheduled"]} />
      {loading && <p>Loading bookings…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && history.filter(booking => filter === "All" || booking.status === filter).length === 0 && <p>No reservations match this filter.</p>}
      <PTable
        cols={["ID", "Resource", "Date", "Time", "Status", "Staff notes", "Pass"]}
        rows={history.filter(booking => filter === "All" || booking.status === filter).map((booking) => [
          `R-${booking.id}`,
          booking.resource,
          new Date(booking.booking_date).toLocaleDateString(),
          booking.time_slot,
          <Badge key={`status-${booking.id}`} label={booking.status} tone={booking.status === "Approved" ? "Active" : booking.status === "Rejected" ? "Rejected" : booking.status === "Rescheduled" ? "Rescheduled" : "Pending"} />,
          booking.admin_notes || "—",
          booking.status === "Approved" ? (
            <Button key={`qr-${booking.id}`} variant="outline" size="sm" icon={LuQrCode} onClick={() => setSelectedQR(booking)}>View pass</Button>
          ) : (
            <span key={`na-${booking.id}`} style={{ color: T.textLight, fontSize: ".8rem" }}>N/A</span>
          ),
        ])}
      />
      {selectedQR && <QRPassModal booking={selectedQR} onClose={() => setSelectedQR(null)} />}
    </div>
  );
}

function EquipmentList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportingItem, setReportingItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getItems();
        setItems(res.data || []);
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="fade-up">
      <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: ".35rem" }}>Equipment & Availability</h2>
      <p style={{ color: T.textLight, fontSize: ".9rem", marginBottom: "1.2rem" }}>Browse available lab equipment and their intended use cases.</p>
      
      {isLoading ? (
        <div style={{ color: T.textLight }}>Loading equipment list...</div>
      ) : (
        <PTable
          cols={["ID", "Name", "Category", "Use Case", "Status", "Action"]}
          rows={items.map((it) => [
            it.id,
            <strong key={`name-${it.id}`} style={{ color: T.navyDark }}>{it.name}</strong>,
            <Badge key={`cat-${it.id}`} label={it.category} tone="Neutral" />,
            <div key={`desc-${it.id}`} style={{ maxWidth: 350, whiteSpace: "normal", lineHeight: 1.4, fontSize: "0.85rem", color: T.textLight }}>
              {it.description}
            </div>,
            <Badge key={`stat-${it.id}`} label={it.status === "available" ? "Available" : "In Use / Maint."} tone={it.status === "available" ? "Active" : "Neutral"} />,
            <Button key={`report-${it.id}`} variant="outline" size="sm" icon={LuTriangleAlert} onClick={() => setReportingItem(it)}>Report an issue</Button>
          ])}
        />
      )}
      <IssueReportModal equipment={reportingItem} onClose={() => setReportingItem(null)} />
    </div>
  );
}

function IssueReportModal({ equipment, onClose }) {
  const [form, setForm] = useState({ issueType: "Hardware fault", urgency: "Normal", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (equipment) {
      setForm({ issueType: "Hardware fault", urgency: "Normal", description: "" });
      setError("");
    }
  }, [equipment]);

  if (!equipment) return null;
  const set = (key) => (e) => setForm((value) => ({ ...value, [key]: e.target.value }));
  const submit = async () => {
    if (!form.description.trim()) {
      setError("Please describe the damage, loss, or hardware fault.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createIssueReport({ equipmentId: equipment.id, ...form });
      alert("Issue report submitted. Lab staff will review it shortly.");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit issue report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Report an issue" subtitle={`This report will be attached to ${equipment.name}.`} onClose={onClose} maxWidth={520}>
      {error && <div role="alert" style={{ marginBottom: "1rem", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, border: `1px solid ${T.danger}26`, color: T.danger, fontSize: ".84rem" }}>{error}</div>}
      <Field label="Issue type" value={form.issueType} onChange={set("issueType")} options={["Damage", "Hardware fault", "Loss"]} />
      <Field label="Urgency" value={form.urgency} onChange={set("urgency")} options={["Low", "Normal", "Urgent"]} />
      <Field label="What happened?" rows={4} value={form.description} onChange={set("description")} placeholder="Describe what you noticed and when it happened..." />
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="danger" icon={LuTriangleAlert} onClick={submit} disabled={saving}>{saving ? "Submitting…" : "Submit report"}</Button>
      </div>
    </Modal>
  );
}

function LabAnnouncements() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNews();
        setNews(response.data || []);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="fade-up">
      <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: ".35rem" }}>Lab Announcements</h2>
      <p style={{ color: T.textLight, fontSize: ".9rem", marginBottom: "1.2rem" }}>Latest updates, events, and important notices from the CV & AI Lab.</p>
      
      {isLoading ? (
        <div style={{ color: T.textLight }}>Loading announcements...</div>
      ) : news.length === 0 ? (
        <div style={{ color: T.textLight }}>No announcements available at this time.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "800px" }}>
          {news.map((item) => (
            <Card key={item.id} style={{ padding: "1.2rem", borderLeft: `4px solid ${T.gold}` }}>
               <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".5rem" }}>
                 <Badge label={item.category || "Notice"} tone="Neutral" />
                 <span style={{ color: T.textLight, fontSize: ".8rem" }}>
                   {new Date(item.published_date || item.created_at).toLocaleDateString()}
                 </span>
               </div>
               <h3 style={{ margin: "0 0 .5rem 0", color: T.navyDark, fontSize: "1.1rem" }}>{item.title}</h3>
               <p style={{ margin: 0, color: T.textMid, fontSize: ".9rem", lineHeight: 1.6 }}>{item.content}</p>
               {(item.image_url || item.video_url) && (
                 <div style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", color: T.navy, fontSize: "0.85rem", fontWeight: 600 }}>
                   <LuFileText size={16} /> Attached Media Available on Main News Page
                 </div>
               )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function StudentPortal({ active }) {
  if (active === "equipment") return <EquipmentList />;
  if (active === "issues") return <MyIssueReports />;
  if (active === "booking") return <BookingForm />;
  if (active === "announcements") return <LabAnnouncements />;
  return <UsageHistory />;
}

function MyIssueReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getIssueReports(true).then((response) => setReports(response.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return <div className="fade-up">
    <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: ".35rem" }}>My issue reports</h2>
    <p style={{ color: T.textLight, fontSize: ".9rem", marginBottom: "1.2rem" }}>Reports submitted from the equipment page are tracked by lab staff.</p>
    {loading ? <p>Loading reports…</p> : reports.length === 0 ? <Card style={{ padding: "1.2rem", color: T.textMid }}>You have not submitted an issue report.</Card> : <PTable cols={["Equipment", "Type", "Description", "Urgency", "Status", "Staff notes"]} rows={reports.map((report) => [report.equipment_name, report.issue_type, report.description, report.urgency, <Badge key={`status-${report.id}`} label={report.status} tone={report.status === "Resolved" ? "Active" : "Pending"} />, report.admin_notes || "—"])} />}
  </div>;
}
