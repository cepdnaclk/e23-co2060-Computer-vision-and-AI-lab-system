import { useState, useEffect } from "react";
import { T } from "../styles/theme";
import { Badge, Field, PTable } from "../components/UI";
import { EQUIPMENT } from "../data/labData";
import { getBookings, createBooking, getItems } from "../services/api";

// ── QR Pass Modal ─────────────────────────────────────
function QRPassModal({ booking, onClose }) {
  if (!booking) return null;
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: T.white, borderRadius: 8, padding: "2rem", maxWidth: 350, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.28)" }}>
        <h3 style={{ color: T.navyDark, marginBottom: "1rem" }}>Lab Access Pass</h3>
        <p style={{ fontSize: "0.85rem", color: T.textLight, marginBottom: "1.5rem" }}>Scan this code at the lab entrance.</p>
        
        <div style={{ border: `2px solid ${T.border}`, padding: "1rem", borderRadius: 8, display: "inline-block", marginBottom: "1.5rem" }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-${booking.id}-${booking.resource}`} alt="QR Code" />
        </div>
        
        <div style={{ background: T.offWhite, padding: "0.8rem", borderRadius: 4, textAlign: "left", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
          <div><strong>ID:</strong> R-{booking.id}</div>
          <div><strong>Resource:</strong> {booking.resource}</div>
          <div><strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</div>
          <div><strong>Time:</strong> {booking.time_slot}</div>
        </div>
        
        <button onClick={onClose} className="btn-navy" style={{ width: "100%", padding: "0.6rem" }}>Close</button>
      </div>
    </div>
  );
}
// ── Booking Form ──────────────────────────────────────
function BookingForm() {
  const TITLE = "Resource Booking Request";
  const [options, setOptions] = useState(["Training Run (A100)", "Consultation - CV Methodology", "Lab Space Access"]);
  const [form, setForm] = useState({ resource: "", date: "", time: "", purpose: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live inventory from Neon DB
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await getItems();
        const dbItems = response.data.map(item => item.name);
        // Combine DB items with standard services
        setOptions([...dbItems, "Training Run (A100)", "Consultation - CV Methodology", "Lab Space Access"]);
      } catch (error) {
        console.error("Failed to fetch dynamic resources:", error);
      }
    };
    fetchResources();
  }, []);

  // Helper to update state as they type
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // 2. The function that talks to your backend
  const handleSubmit = async () => {
    if (!form.resource || !form.date || !form.time) {
      alert("Please select a resource, date, and time slot.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createBooking({
        requestType: "General Booking",
        resource: form.resource,
        date: form.date,
        time: form.time,
        purpose: form.purpose
      });
      
      alert("Success! Your booking request has been submitted for admin approval.");
      
      // Clear the form fields after a successful submission
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
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: ".35rem" }}>{TITLE}</h2>
      <p style={{ color: T.textLight, fontSize: ".83rem", marginBottom: "1.5rem" }}>Submit your request. All bookings are subject to staff/admin approval.</p>
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: "1.75rem", maxWidth: 520 }}>
        
        {/* 3. Bind the fields to our state */}
        <Field label="Resource / Type" value={form.resource} onChange={set("resource")} options={options} />
        <Field label="Preferred Date"  type="date" value={form.date} onChange={set("date")} />
        <Field label="Time Slot"       value={form.time} onChange={set("time")} options={["08:00–10:00","10:00–12:00","13:00–15:00","15:00–17:00","17:00–19:00"]} />
        <Field label="Purpose / Notes" rows={3}   value={form.purpose} onChange={set("purpose")} placeholder="Describe your intended use..." />
        
        {/* 4. Trigger our new submit function */}
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="btn-navy" 
          style={{ width: "100%", padding: ".7rem", opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
}

// ── Usage History (My Bookings) ───────────────────────
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
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>My Bookings</h2>
      <PTable 
        cols={["ID","Resource","Date","Time","Status","Pass"]} 
        rows={history.map(r => [
          `R-${r.id}`, 
          r.resource, 
          new Date(r.booking_date).toLocaleDateString(), 
          r.time_slot, 
          <Badge key={`b-${r.id}`} label={r.status} color={r.status === "Approved" ? T.green : (r.status === "Rejected" ? T.red : T.amber)} />,
          r.status === "Approved" ? (
            <button key={`qr-${r.id}`} onClick={() => setSelectedQR(r)} style={{ padding: "4px 8px", background: T.navy, color: "white", border: "none", borderRadius: "3px", fontSize: "0.75rem", cursor: "pointer", fontWeight: "bold" }}>
              📷 View Pass
            </button>
          ) : <span key={`np-${r.id}`} style={{ color: T.textLight, fontSize: "0.75rem" }}>N/A</span>
        ])} 
      />
      {selectedQR && <QRPassModal booking={selectedQR} onClose={() => setSelectedQR(null)} />}
    </div>
  );
}

// ── Main Student Portal ───────────────────────────────
export function StudentPortal({ active }) {
  if (active === "booking") return <BookingForm />;
  if (active === "history") return <UsageHistory />;

  return <div style={{ padding: "2rem", color: T.textMid, fontSize: ".87rem" }}>Select a section from the sidebar.</div>;
}
