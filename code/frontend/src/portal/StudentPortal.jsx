import { useEffect, useState } from "react";
import { LuCamera, LuClock3, LuQrCode, LuUpload } from "react-icons/lu";
import { T } from "../styles/theme";
import { Badge, Button, Card, Field, PTable } from "../components/UI";
import { EQUIPMENT } from "../data/labData";
import { createBooking, getBookings, getItems } from "../services/api";

function QRPassModal({ booking, onClose }) {
  if (!booking) return null;
  return (
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
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=BOOKING-${booking.id}-${booking.resource}`} alt="QR code" />
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
    </div>
  );
}

function BookingForm() {
  const [options, setOptions] = useState(["Training Run (A100)", "Consultation - CV Methodology", "Lab Space Access"]);
  const [form, setForm] = useState({ resource: "", date: "", time: "", purpose: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState("");

  // Today in YYYY-MM-DD format (local time) — used as the min date
  const todayStr = new Date().toLocaleDateString("en-CA"); // e.g. "2025-07-21"

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await getItems();
        const dbItems = response.data.map((item) => item.name);
        setOptions([...dbItems, "Training Run (A100)", "Consultation - CV Methodology", "Lab Space Access"]);
      } catch (error) {
        console.error("Failed to fetch dynamic resources:", error);
      }
    };
    fetchResources();
  }, []);

  const set = (key) => (e) => setForm((value) => ({ ...value, [key]: e.target.value }));

  const handleDateChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, date: val }));

    if (!val) { setDateError(""); return; }

    // Parse date parts directly from the string to avoid timezone issues
    const [year, month, day] = val.split("-").map(Number);
    const picked = new Date(year, month - 1, day); // local date
    const dayOfWeek = picked.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setDateError("Weekends (Saturday & Sunday) are not available for booking. Please choose a weekday.");
    } else {
      setDateError("");
    }
  };

  const handleSubmit = async () => {
    if (!form.resource || !form.date || !form.time) {
      alert("Please select a resource, date, and time slot.");
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
      alert("Failed to submit the booking request.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Field label="Time slot" value={form.time} onChange={set("time")} options={["08:00–10:00", "10:00–12:00", "13:00–15:00", "15:00–17:00"]} icon={LuClock3} />
        <Field label="Purpose / notes" rows={3} value={form.purpose} onChange={set("purpose")} placeholder="Describe your intended use..." />
        <Button variant="primary" icon={LuUpload} fullWidth onClick={handleSubmit} disabled={isSubmitting || !!dateError}>{isSubmitting ? "Submitting…" : "Submit request"}</Button>
      </Card>
    </div>
  );
}


function UsageHistory() {
  const [history, setHistory] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="fade-up">
      <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: "1.15rem" }}>My bookings</h2>
      <PTable
        cols={["ID", "Resource", "Date", "Time", "Status", "Pass"]}
        rows={history.map((booking) => [
          `R-${booking.id}`,
          booking.resource,
          new Date(booking.booking_date).toLocaleDateString(),
          booking.time_slot,
          <Badge key={`status-${booking.id}`} label={booking.status} tone={booking.status === "Approved" ? "Active" : booking.status === "Rejected" ? "Rejected" : "Pending"} />,
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
      <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: ".35rem" }}>Equipments & Availability</h2>
      <p style={{ color: T.textLight, fontSize: ".9rem", marginBottom: "1.2rem" }}>Browse available lab equipment and their intended use cases.</p>
      
      {isLoading ? (
        <div style={{ color: T.textLight }}>Loading equipment list...</div>
      ) : (
        <PTable
          cols={["ID", "Name", "Category", "Use Case", "Status"]}
          rows={items.map((it) => [
            it.id,
            <strong key={`name-${it.id}`} style={{ color: T.navyDark }}>{it.name}</strong>,
            <Badge key={`cat-${it.id}`} label={it.category} tone="Neutral" />,
            <div key={`desc-${it.id}`} style={{ maxWidth: 350, whiteSpace: "normal", lineHeight: 1.4, fontSize: "0.85rem", color: T.textLight }}>
              {it.description}
            </div>,
            <Badge key={`stat-${it.id}`} label={it.status === "available" ? "Available" : "In Use / Maint."} tone={it.status === "available" ? "Active" : "Neutral"} />
          ])}
        />
      )}
    </div>
  );
}

export function StudentPortal({ active }) {
  if (active === "equipment") return <EquipmentList />;
  if (active === "booking") return <BookingForm />;
  return <UsageHistory />;
}
