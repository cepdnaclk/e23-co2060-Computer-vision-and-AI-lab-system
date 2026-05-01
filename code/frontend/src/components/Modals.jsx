import { useState } from "react";
import { T } from "../styles/theme";
import { Field } from "./UI";
import { EQUIPMENT } from "../data/labData";

// Import your API functions
import { loginUser, registerUser, createBooking } from "../services/api"; 

// ── Booking Modal ─────────────────────────────────────
export function BookingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ type: "", resource: "", date: "", time: "", purpose: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); //loading state for submission

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const canProceed1 = form.type && form.resource;
  const canProceed2 = form.date && form.time;

  // The function that sends the booking to your Express backend
  const handleSubmitBooking = async () => {
    try {
      setIsSubmitting(true);
      await createBooking({
        requestType: form.type,
        resource: form.resource,
        date: form.date,
        time: form.time,
        purpose: form.purpose
      });
      alert("Success! Your booking request has been sent for admin approval.");
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit the booking request. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <button onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1 }} disabled={isSubmitting}>← Back</button>

                {/* Updated Submit Button */}
                <button 
                  onClick={handleSubmitBooking} 
                  disabled={isSubmitting}
                  style={{ flex: 2, background: T.green, color: T.white, border: "none", padding: ".65rem", fontWeight: 700, fontSize: ".85rem", borderRadius: 3, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Submitting..." : "✓ Submit Request"}
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
export function LoginModal({ onLogin, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setError(""); 

      const response = await loginUser({ email, password });

      // Save token and user to local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Translate backend "officer" to frontend "admin" so the UI menus don't break
      const backendRole = response.data.user.role;
      const frontendRole = backendRole === "officer" ? "admin" : backendRole;
      
      onLogin(frontendRole); 

    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Cannot connect to server. Please ensure the backend is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Press Enter from any field to trigger sign in
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignIn();
  };

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
          {error && (
            <div style={{ padding: "10px", marginBottom: "15px", background: "#fee2e2", color: "#991b1b", border: "1px solid #f87171", borderRadius: "3px", fontSize: "0.85rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <Field label="University Email" type="email"    placeholder="id@pdn.ac.lk" value={email}    onChange={(e) => setEmail(e.target.value)}    onKeyDown={handleKeyDown} />
          <Field label="Password"         type="password" placeholder="••••••••"      value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />

          <button onClick={handleSignIn} disabled={isLoading} className="btn-navy" style={{ width: "100%", padding: ".7rem", fontSize: ".9rem", opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? "Verifying..." : "Sign In to Portal"}
          </button>
          
          <button onClick={onClose} style={{ width: "100%", padding: ".55rem", background: "none", border: "none", color: T.textLight, fontSize: ".79rem", marginTop: ".5rem", cursor: "pointer" }}>
            Cancel
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${T.border}`, fontSize: ".73rem", color: T.textLight }}>
            New to the portal? <span onClick={onSwitchToRegister} style={{ color: T.navy, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Create an account</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Registration Modal ────────────────────────────────
export function RegisterModal({ onSuccess, onClose, onSwitchToLogin }) {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Press Enter from any field to trigger registration
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await registerUser({ name, email, password, role });

      alert("Registration successful! Please log in with your credentials.");
      onSuccess();
      if (onSwitchToLogin) onSwitchToLogin();

    } catch (err) {
      console.error("Registration failed:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.white, borderRadius: 4, width: "100%", maxWidth: 450, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.28)" }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${T.green},${T.navy})`, padding: "2rem", textAlign: "center", borderBottom: `3px solid ${T.gold}` }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", margin: "0 auto 1rem" }}>✨</div>
          <div style={{ color: T.gold, fontSize: ".67rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: ".3rem" }}>New Account</div>
          <div style={{ color: T.white, fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Noto Serif',serif" }}>Join CV & AI Laboratory</div>
          <div style={{ color: "#8faac0", fontSize: ".79rem" }}>University of Peradeniya</div>
        </div>

        <div style={{ padding: "1.75rem" }}>
          {/* Role selector */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label className="inp-label">Account Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", marginTop: ".35rem" }}>
              {[["student","Student"],["staff","Staff"]].map(([v, l]) => (
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

          {error && (
            <div style={{ padding: "10px", marginBottom: "15px", background: "#fee2e2", color: "#991b1b", border: "1px solid #f87171", borderRadius: "3px", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <Field label="Full Name"        type="text"     placeholder="John Doe"      value={name}            onChange={(e) => setName(e.target.value)}            onKeyDown={handleKeyDown} />
          <Field label="University Email" type="email"    placeholder="id@pdn.ac.lk"  value={email}           onChange={(e) => setEmail(e.target.value)}           onKeyDown={handleKeyDown} />
          <Field label="Password"         type="password" placeholder="••••••••"      value={password}        onChange={(e) => setPassword(e.target.value)}        onKeyDown={handleKeyDown} />
          <Field label="Confirm Password" type="password" placeholder="••••••••"      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={handleKeyDown} />

          <button onClick={handleRegister} disabled={isLoading} className="btn-navy" style={{ width: "100%", padding: ".7rem", fontSize: ".9rem", background: T.green, opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>

          <button onClick={onClose} style={{ width: "100%", padding: ".55rem", background: "none", border: "none", color: T.textLight, fontSize: ".79rem", marginTop: ".5rem", cursor: "pointer" }}>
            Cancel
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${T.border}`, fontSize: ".73rem", color: T.textLight }}>
            Already have an account? <span onClick={onSwitchToLogin} style={{ color: T.navy, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Sign in here</span>
          </div>
        </div>
      </div>
    </div>
  );
}
