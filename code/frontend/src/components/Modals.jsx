import { useState } from "react";
import { LuArrowRight, LuCalendarClock, LuCircleCheckBig, LuCircleAlert, LuLockKeyhole, LuUserPlus } from "react-icons/lu";
import { T } from "../styles/theme";
import { Button, Field, Modal } from "./UI";
import { EQUIPMENT } from "../data/labData";
import { loginUser, registerUser, createBooking } from "../services/api";

export function BookingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ type: "", resource: "", date: "", time: "", purpose: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canProceed1 = form.type && form.resource;
  const canProceed2 = form.date && form.time;

  const handleSubmitBooking = async () => {
    try {
      setIsSubmitting(true);
      await createBooking({
        requestType: form.type,
        resource: form.resource,
        date: form.date,
        time: form.time,
        purpose: form.purpose,
      });
      alert("Success! Your booking request has been sent for admin approval.");
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit the booking request. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Resource booking request"
      subtitle="Reserve equipment or request lab access with a clear review trail."
      onClose={onClose}
      maxWidth={660}
    >
      <div style={{ display: "flex", gap: ".55rem", marginBottom: "1.1rem", flexWrap: "wrap" }}>
        {["Select resource", "Schedule", "Review"].map((label, index) => {
          const active = step === index + 1;
          return (
            <div key={label} style={{ flex: "1 1 140px", padding: ".7rem .8rem", borderRadius: 14, border: `1px solid ${active ? T.gold : T.border}`, background: active ? `${T.gold}12` : T.surfaceAlt, color: active ? T.navyDark : T.textMid, fontSize: ".76rem", fontWeight: 700, textAlign: "center" }}>
              {index + 1}. {label}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <>
          <Field label="Request type" value={form.type} onChange={set("type")} options={[
            { value: "Lab Space Reservation", label: "Lab Space Reservation" },
            { value: "Equipment Booking", label: "Equipment Booking" },
            { value: "GPU Processing Request", label: "GPU Processing Request" },
            { value: "AI Consultation Request", label: "AI Consultation Request" },
          ]} icon={LuCalendarClock} />
          <Field label="Specific resource" value={form.resource} onChange={set("resource")} options={EQUIPMENT.map((e) => e.name)} icon={LuCircleCheckBig} />
          <Button variant="primary" fullWidth icon={LuArrowRight} onClick={() => setStep(2)} disabled={!canProceed1}>Continue</Button>
        </>
      )}

      {step === 2 && (
        <>
          <Field label="Preferred date" type="date" value={form.date} onChange={set("date")} icon={LuCalendarClock} />
          <Field label="Time slot" value={form.time} onChange={set("time")} options={[
            "08:00–10:00",
            "10:00–12:00",
            "13:00–15:00",
            "15:00–17:00",
            "17:00–19:00",
          ]} icon={LuCircleCheckBig} />
          <Field label="Purpose / notes" value={form.purpose} onChange={set("purpose")} rows={3} placeholder="Describe your intended use and project context..." />
          <div style={{ display: "flex", gap: ".75rem" }}>
            <Button variant="outline" fullWidth onClick={() => setStep(1)} disabled={isSubmitting}>Back</Button>
            <Button variant="primary" fullWidth icon={LuArrowRight} onClick={() => setStep(3)} disabled={!canProceed2}>Review</Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 16, padding: "1rem 1.1rem", marginBottom: "1rem" }}>
            {[["Request type", form.type], ["Resource", form.resource], ["Date", form.date], ["Time", form.time], ["Purpose", form.purpose || "—"]].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: ".5rem 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ color: T.textLight, fontSize: ".85rem" }}>{label}</span>
                <span style={{ color: T.text, fontWeight: 600, fontSize: ".85rem", textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: ".65rem", alignItems: "flex-start", padding: "1rem", borderRadius: 16, border: `1px solid ${T.warning}28`, background: `${T.warning}12`, color: T.warning, fontSize: ".84rem", marginBottom: "1rem" }}>
            <LuCircleAlert size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>Bookings are subject to staff or admin approval. Fees are confirmed upon review.</span>
          </div>
          <div style={{ display: "flex", gap: ".75rem" }}>
            <Button variant="outline" fullWidth onClick={() => setStep(2)} disabled={isSubmitting}>Back</Button>
            <Button variant="gold" fullWidth icon={LuCircleCheckBig} onClick={handleSubmitBooking} disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit request"}</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

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
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const backendRole = response.data.user.role;
      onLogin(backendRole);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Cannot connect to server. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignIn();
  };

  return (
    <Modal title="Internal portal access" subtitle="Sign in to manage bookings, people, news, and equipment." onClose={onClose} maxWidth={460}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 18, background: `${T.gold}18`, color: T.gold, margin: "0 auto" }}>
          <LuLockKeyhole size={24} />
        </div>
        {error && (
          <div style={{ display: "flex", gap: ".55rem", alignItems: "flex-start", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, color: T.danger, border: `1px solid ${T.danger}26`, fontSize: ".84rem" }}>
            <LuCircleAlert size={15} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        <Field label="University email" type="email" placeholder="id@pdn.ac.lk" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} icon={LuLockKeyhole} />
        <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} icon={LuLockKeyhole} />
        <Button variant="primary" fullWidth onClick={handleSignIn} disabled={isLoading}>{isLoading ? "Verifying…" : "Sign in"}</Button>
        <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
        <div style={{ textAlign: "center", color: T.textLight, fontSize: ".82rem", paddingTop: ".2rem" }}>
          New to the portal? <button type="button" onClick={onSwitchToRegister} style={{ border: 0, background: "none", padding: 0, color: T.navy, fontWeight: 700, textDecoration: "underline" }}>Create an account</button>
        </div>
      </div>
    </Modal>
  );
}

export function RegisterModal({ onSuccess, onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const INTERNAL_DOMAIN = "@eng.pdn.ac.lk";
  const isInternalEmail = email.toLowerCase().endsWith(INTERNAL_DOMAIN);
  const isExternalEmail = email.includes("@") && !isInternalEmail;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.toLowerCase().endsWith(INTERNAL_DOMAIN)) {
      setError(`Only University of Peradeniya students can self-register. Your email must end with ${INTERNAL_DOMAIN}.`);
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

    try {
      setIsLoading(true);
      setError("");
      await registerUser({ name, email, password });
      alert("Registration successful! You can now sign in with your university email.");
      onSuccess();
      onSwitchToLogin?.();
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Create an account" subtitle="University of Peradeniya students can register instantly." onClose={onClose} maxWidth={500}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 18, background: `${T.success}10`, color: T.success, margin: "0 auto" }}>
          <LuUserPlus size={24} />
        </div>

        {/* External user info box */}
        {isExternalEmail && (
          <div style={{ display: "flex", gap: ".6rem", alignItems: "flex-start", padding: ".9rem 1rem", borderRadius: 14, background: `${T.warning}12`, border: `1px solid ${T.warning}30`, color: T.warning, fontSize: ".84rem", lineHeight: 1.6 }}>
            <LuCircleAlert size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>
              <strong>External user?</strong> Self-registration is only for <strong>@eng.pdn.ac.lk</strong> addresses.
              Please email <a href="mailto:cvailab@pdn.ac.lk" style={{ color: T.warning, fontWeight: 700 }}>cvailab@pdn.ac.lk</a> and the lab admin will create your account.
            </span>
          </div>
        )}

        {error && (
          <div style={{ display: "flex", gap: ".55rem", alignItems: "flex-start", padding: ".85rem .95rem", borderRadius: 14, background: `${T.danger}10`, color: T.danger, border: `1px solid ${T.danger}26`, fontSize: ".84rem" }}>
            <LuCircleAlert size={15} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <Field label="Full name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} icon={LuUserPlus} />
        <Field label="University email" type="email" placeholder="eXXXXX@eng.pdn.ac.lk" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} icon={LuLockKeyhole} />
        <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} icon={LuLockKeyhole} />
        <Field label="Confirm password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={handleKeyDown} icon={LuLockKeyhole} />

        <Button variant="primary" fullWidth onClick={handleRegister} disabled={isLoading || isExternalEmail}>
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
        <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
        <div style={{ textAlign: "center", color: T.textLight, fontSize: ".82rem", paddingTop: ".2rem" }}>
          Already have an account? <button type="button" onClick={onSwitchToLogin} style={{ border: 0, background: "none", padding: 0, color: T.navy, fontWeight: 700, textDecoration: "underline" }}>Sign in here</button>
        </div>
      </div>
    </Modal>
  );
}
