import { LuMail, LuMapPin, LuPhone, LuClock3, LuSend } from "react-icons/lu";
import { T } from "../styles/theme";
import { Button, Card, Divider, Field, SectionLabel, SectionTitle } from "../components/UI";
import { renderIcon } from "../components/iconUtils";

const CONTACT_INFO = [
  { icon: LuMapPin, label: "Address", value: "Building D, Floor 3\nFaculty of Engineering\nUniversity of Peradeniya\nPeradeniya 20400, Sri Lanka" },
  { icon: LuMail, label: "Email", value: "cvailab@pdn.ac.lk" },
  { icon: LuPhone, label: "Phone", value: "+94 81 238 9000 ext. 4520" },
  { icon: LuClock3, label: "Office hours", value: "Mon – Fri: 9:00 AM – 5:00 PM (SLST)" },
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
    <div className="page-shell section-padding">
      <SectionLabel text="Contact" />
      <SectionTitle>Get in touch</SectionTitle>
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: ".92fr 1.08fr", gap: "1.4rem", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
            <Card key={label} style={{ padding: "1rem", display: "flex", gap: ".9rem", alignItems: "flex-start" }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{renderIcon(Icon, { size: 18 })}</div>
              <div>
                <div style={{ fontWeight: 700, color: T.navyDark, marginBottom: ".2rem" }}>{label}</div>
                <div style={{ color: T.textMid, whiteSpace: "pre-line", lineHeight: 1.7, fontSize: ".88rem" }}>{value}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card style={{ padding: "1.2rem" }}>
          <div style={{ background: `${T.navy}08`, border: `1px solid ${T.border}`, borderRadius: 16, padding: "1rem", marginBottom: "1rem" }}>
            <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Send a message</div>
            <div style={{ color: T.navyDark, fontWeight: 700, marginTop: ".35rem" }}>Contact the laboratory office</div>
          </div>
          <Field label="Full name" placeholder="Your full name" />
          <Field label="Email address" type="email" placeholder="your@email.com" />
          <Field label="Subject" options={SUBJECT_OPTIONS} />
          <Field label="Message" rows={5} placeholder="Write your message here..." />
          <Button variant="primary" icon={LuSend} fullWidth>Send message</Button>
        </Card>
      </div>
    </div>
  );
}
