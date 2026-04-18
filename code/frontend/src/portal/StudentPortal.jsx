import { useState } from "react";
import { T } from "../styles/theme";
import { Badge, Field, PStat, PTable, PanelTitle, QuickBtn } from "../components/UI";
import { PROJECTS, EQUIPMENT, ALL_RESERVATIONS } from "../data/labData";
import { createBooking } from "../services/api";

const MY_RESERVATIONS = [
  { id:"R-001", resource:"GPU Cluster (A100)", date:"2025-03-12", time:"10:00–12:00", status:"Approved", fee:"LKR 1,000" },
  { id:"R-002", resource:"Drone Fleet",        date:"2025-03-14", time:"14:00–16:00", status:"Pending",  fee:"LKR 800"   },
  { id:"R-003", resource:"Camera Array",       date:"2025-03-20", time:"09:00–11:00", status:"Approved", fee:"LKR 600"   },
];

// ── Dashboard ─────────────────────────────────────────
function Dashboard({ setShowBooking }) {
  return (
    <div className="fade-up">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.4rem", fontWeight: 700, color: T.navyDark }}>Welcome, Sarah Kim</h2>
        <div style={{ color: T.textLight, fontSize: ".81rem" }}>PhD Candidate · Computer Science · CV & AI Laboratory</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <PStat icon="📅" label="Active Bookings" value="2"   sub="1 pending approval" color={T.navyLight} />
        <PStat icon="⚡" label="GPU Hours Used"  value="14h" sub="This month"          color={T.green}    />
        <PStat icon="🔬" label="Projects"         value="2"   sub="1 active"            color={T.navy}     />
        <PStat icon="💬" label="Consultations"    value="1"   sub="Scheduled Mar 18"    color={T.gold}     />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div>
          <PanelTitle>Recent Reservations</PanelTitle>
          <PTable
            cols={["ID","Resource","Date","Time","Status","Fee"]}
            rows={MY_RESERVATIONS.map(r => [r.id, r.resource, r.date, r.time, <Badge label={r.status} />, r.fee])}
          />
        </div>
        <div>
          <PanelTitle>Quick Actions</PanelTitle>
          <div style={{ display: "grid", gap: ".6rem" }}>
            <QuickBtn icon="📷" label="Book Equipment"       onClick={() => setShowBooking(true)} />
            <QuickBtn icon="⚡" label="Request GPU Time"     onClick={() => setShowBooking(true)} />
            <QuickBtn icon="💬" label="Request Consultation" onClick={() => setShowBooking(true)} />
            <QuickBtn icon="🏛️" label="Reserve Lab Space"   onClick={() => setShowBooking(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Booking Form ──────────────────────────────────────
function BookingForm({ active }) {
  const TITLES = {
    equipment:"Equipment Booking", reservation:"Lab Space Reservation",
    gpu:"GPU Processing Request",  consultation:"Consultation Request",
  };
  const OPTS = {
    gpu:          ["Training Run (A100)","Inference Batch","Fine-tuning Job"],
    consultation: ["CV Methodology","Dataset Advice","Model Selection","Publication Review"],
  };

  // 1. Add state to track user input
  const [form, setForm] = useState({ resource: "", date: "", time: "", purpose: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        requestType: TITLES[active], // Uses the title (e.g., "Equipment Booking") as the type
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
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: ".35rem" }}>{TITLES[active]}</h2>
      <p style={{ color: T.textLight, fontSize: ".83rem", marginBottom: "1.5rem" }}>Submit your request. All bookings are subject to staff/admin approval.</p>
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: "1.75rem", maxWidth: 520 }}>
        
        {/* 3. Bind the fields to our state */}
        <Field label="Resource / Type" value={form.resource} onChange={set("resource")} options={OPTS[active] || EQUIPMENT.map(e => e.name)} />
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

// ── Usage History ─────────────────────────────────────
function UsageHistory() {
  const all = [...MY_RESERVATIONS, { id:"R-000", resource:"HPC Server", date:"2025-02-20", time:"13:00–15:00", status:"Approved", fee:"LKR 800" }];
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>Usage History</h2>
      <PTable cols={["ID","Resource","Date","Time","Status","Fee"]} rows={all.map(r => [r.id, r.resource, r.date, r.time, <Badge label={r.status} />, r.fee])} />
    </div>
  );
}

// ── Projects ──────────────────────────────────────────
function MyProjects() {
  const mine = PROJECTS.filter(p => p.lead.includes("Kim") || p.id === 4);
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>My Project Participation</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        {mine.map(p => (
          <div key={p.title} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: "1.25rem", borderLeft: `4px solid ${p.status === "Active" ? T.green : T.textLight}` }}>
            <div style={{ display: "flex", gap: ".6rem", marginBottom: ".4rem" }}>
              <Badge label={p.status} />
              <span style={{ color: T.textLight, fontSize: ".73rem" }}>{p.year}</span>
            </div>
            <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".95rem", fontFamily: "'Noto Serif',serif" }}>{p.title}</div>
            <p style={{ color: T.textMid, fontSize: ".83rem", lineHeight: 1.6, marginTop: ".3rem" }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────
function Profile() {
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>My Profile</h2>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "flex-start", maxWidth: 660 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg,${T.navy},${T.navyLight})`, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1rem" }}>SK</div>
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: "1.5rem" }}>
          <Field label="Full Name"        value="Sarah Kim"              onChange={() => {}} />
          <Field label="University Email" value="sarah.kim@pdn.ac.lk"   onChange={() => {}} />
          <Field label="Department"       value="Computer Science"        onChange={() => {}} />
          <Field label="Programme"        value="PhD in Computer Science" onChange={() => {}} />
          <Field label="Research Area"    value="Autonomous Drones"       onChange={() => {}} />
          <button className="btn-navy" style={{ padding: ".6rem 1.5rem" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Student Portal ───────────────────────────────
export function StudentPortal({ active, setShowBooking }) {
  const BOOKING_TABS = ["equipment","reservation","gpu","consultation"];

  if (active === "dashboard")           return <Dashboard setShowBooking={setShowBooking} />;
  if (BOOKING_TABS.includes(active))    return <BookingForm active={active} setShowBooking={setShowBooking} />;
  if (active === "history")             return <UsageHistory />;
  if (active === "projects")            return <MyProjects />;
  if (active === "profile")             return <Profile />;

  return <div style={{ padding: "2rem", color: T.textMid, fontSize: ".87rem" }}>Select a section from the sidebar.</div>;
}
