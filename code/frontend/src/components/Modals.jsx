import { useState } from "react";
import { T } from "../styles/theme";
import { Field } from "./UI";
import { EQUIPMENT } from "../data/labData";

// ── Booking Modal ─────────────────────────────────────
export function BookingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ type: "", resource: "", date: "", time: "", purpose: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const canProceed1 = form.type && form.resource;
  const canProceed2 = form.date && form.time;

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.white, borderRadius: 4, width: "100%", maxWidth: 500, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.28)" }}>

        {/* Header */}
        <div style={{ background: T.navyDark, padding: "1.1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `3px solid ${T.gold}` }}>
          <div>
            <div style={{ color: T.gold, fontSize: ".67rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>CV & AI Laboratory</div>
            <div style={{ color: T.white, fontSize: "1.05rem", fontWeight: 700, fontFamily: "'Noto Serif',serif" }}>Resource Booking Request</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff70", fontSize: "1.5rem", lineHeight: 1 }}>×</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", background: T.offWhite, borderBottom: `1px solid ${T.border}` }}>
          {["Select Resource", "Schedule", "Confirm"].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: ".6rem", textAlign: "center", fontSize: ".73rem", fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? T.navy : T.textLight, borderBottom: step === i + 1 ? `2px solid ${T.gold}` : "2px solid transparent" }}>
              <span style={{ fontWeight: 700, marginRight: ".3rem", fontSize: ".7rem" }}>{i + 1}.</span>{s}
            </div>
          ))}
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Step 1 */}
          {step === 1 && (
            <>
              <Field label="Request Type"      value={form.type}     onChange={set("type")}     options={["Lab Space Reservation","Equipment Booking","GPU Processing Request","AI Consultation Request"]} />
              <Field label="Specific Resource" value={form.resource} onChange={set("resource")} options={EQUIPMENT.map(e => e.name)} />
              <button disabled={!canProceed1} onClick={() => setStep(2)} className="btn-navy" style={{ width: "100%", padding: ".7rem", marginTop: ".25rem", opacity: canProceed1 ? 1 : .5 }}>
                Continue →
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <Field label="Preferred Date" type="date"  value={form.date}    onChange={set("date")}    />
              <Field label="Time Slot"                   value={form.time}    onChange={set("time")}    options={["08:00–10:00","10:00–12:00","13:00–15:00","15:00–17:00","17:00–19:00"]} />
              <Field label="Purpose / Notes"             value={form.purpose} onChange={set("purpose")} rows={3} placeholder="Describe your intended use and project context..." />
              <div style={{ display: "flex", gap: ".75rem", marginTop: ".25rem" }}>
                <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1 }}>← Back</button>
                <button disabled={!canProceed2} onClick={() => setStep(3)} className="btn-navy" style={{ flex: 2, opacity: canProceed2 ? 1 : .5 }}>Review →</button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div style={{ background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 3, padding: "1rem", marginBottom: "1rem" }}>
                {[["Request Type",form.type],["Resource",form.resource],["Date",form.date],["Time",form.time],["Purpose",form.purpose||"—"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: ".4rem 0", borderBottom: `1px solid ${T.border}`, fontSize: ".84rem" }}>
                    <span style={{ color: T.textLight, minWidth: 110 }}>{k}</span>
                    <span style={{ color: T.textDark, fontWeight: 500, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: ".75rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 3, fontSize: ".79rem", color: "#92400e", marginBottom: "1rem" }}>
                ℹ Booking subject to staff/admin approval. Fees calculated upon approval.
              </div>
              <div style={{ display: "flex", gap: ".75rem" }}>
                <button onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1 }}>← Back</button>
                <button onClick={onClose} style={{ flex: 2, background: T.green, color: T.white, border: "none", padding: ".65rem", fontWeight: 700, fontSize: ".85rem", borderRadius: 3, cursor: "pointer" }}>
                  ✓ Submit Request
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Login Modal ───────────────────────────────────────
export function LoginModal({ onLogin, onClose }) {
  const [role, setRole] = useState("student");

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.white, borderRadius: 4, width: "100%", maxWidth: 400, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.28)" }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${T.navyDark},${T.navy})`, padding: "2rem", textAlign: "center", borderBottom: `3px solid ${T.gold}` }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", margin: "0 auto 1rem" }}>🔐</div>
          <div style={{ color: T.gold, fontSize: ".67rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: ".3rem" }}>Internal Portal Access</div>
          <div style={{ color: T.white, fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Noto Serif',serif" }}>CV & AI Laboratory</div>
          <div style={{ color: "#8faac0", fontSize: ".79rem" }}>University of Peradeniya</div>
        </div>

        <div style={{ padding: "1.75rem" }}>
          {/* Role selector */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label className="inp-label">Login As</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".5rem", marginTop: ".35rem" }}>
              {[["student","Student"],["staff","Staff"],["admin","Lab Admin"]].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setRole(v)}
                  style={{ padding: ".5rem", border: `1.5px solid ${role === v ? T.navy : T.border}`, background: role === v ? T.navy : "transparent", color: role === v ? T.white : T.textMid, borderRadius: 3, fontWeight: 600, fontSize: ".81rem" }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <Field label="University Email" type="email"    placeholder="id@pdn.ac.lk" value="" onChange={() => {}} />
          <Field label="Password"         type="password" placeholder="••••••••"      value="" onChange={() => {}} />

          <button onClick={() => onLogin(role)} className="btn-navy" style={{ width: "100%", padding: ".7rem", fontSize: ".9rem" }}>
            Sign In to Portal
          </button>
          <button onClick={onClose} style={{ width: "100%", padding: ".55rem", background: "none", border: "none", color: T.textLight, fontSize: ".79rem", marginTop: ".5rem", cursor: "pointer" }}>
            Cancel
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${T.border}`, fontSize: ".73rem", color: T.textLight }}>
            Forgot password? Contact <span style={{ color: T.navy, fontWeight: 600 }}>itsupport@pdn.ac.lk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
