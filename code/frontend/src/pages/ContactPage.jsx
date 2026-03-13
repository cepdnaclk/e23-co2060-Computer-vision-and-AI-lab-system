import { T } from "../styles/theme";
import { Field, SectionLabel, SectionTitle, Divider } from "../components/UI";

const CONTACT_INFO = [
  ["📍", "Address",      "Building D, Floor 3\nFaculty of Engineering\nUniversity of Peradeniya\nPeradeniya 20400, Sri Lanka"],
  ["📧", "Email",        "cvailab@pdn.ac.lk"],
  ["📞", "Phone",        "+94 81 238 9000 ext. 4520"],
  ["🕐", "Office Hours", "Mon – Fri: 9:00 AM – 5:00 PM (SLST)"],
];

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Research Collaboration",
  "Student Application",
  "Equipment Query",
  "Media Enquiry",
];

export function ContactPage() {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <SectionLabel text="Contact" />
      <SectionTitle>Get in Touch</SectionTitle>
      <Divider />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "2.5rem", alignItems: "flex-start" }}>
        {/* Contact info cards */}
        <div>
          {CONTACT_INFO.map(([icon, label, val]) => (
            <div key={label} style={{ display: "flex", gap: ".85rem", marginBottom: "1rem", padding: "1rem", background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, borderLeft: `3px solid ${T.gold}` }}>
              <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: T.navy, fontSize: ".84rem", marginBottom: ".2rem" }}>{label}</div>
                <div style={{ color: T.textMid, fontSize: ".82rem", whiteSpace: "pre-line", lineHeight: 1.6 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ background: T.navy, padding: ".85rem 1.25rem" }}>
            <div style={{ color: T.gold, fontSize: ".69rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
              Send a Message
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <Field label="Full Name"     placeholder="Your full name"    value="" onChange={() => {}} />
            <Field label="Email Address" type="email" placeholder="your@email.com" value="" onChange={() => {}} />
            <Field label="Subject"       value="" onChange={() => {}} options={SUBJECT_OPTIONS} />
            <Field label="Message"       rows={4} placeholder="Write your message here..." value="" onChange={() => {}} />
            <button className="btn-navy" style={{ width: "100%", padding: ".7rem" }}>
              Send Message →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
