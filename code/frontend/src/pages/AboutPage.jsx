import { LuMapPin, LuUsers, LuFlaskConical, LuShieldCheck } from "react-icons/lu";
import { T } from "../styles/theme";
import { Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { renderIcon } from "../components/iconUtils";
import { ICONS } from "../data/labData";

export function AboutPage() {
  const highlights = [
    { title: "Mission", desc: "Build dependable AI for visual understanding and decision support.", icon: ICONS.about },
    { title: "Focus", desc: "Research in vision, robotics, and applied machine learning with strong engineering standards.", icon: LuFlaskConical },
    { title: "Culture", desc: "Careful supervision, reproducible methods, and a readable public identity.", icon: LuShieldCheck },
    { title: "Collaboration", desc: "Open to staff, students, and external partners working on serious applied projects.", icon: LuUsers },
  ];

  return (
    <div className="page-shell section-padding">
      <div style={{ display: "grid", gridTemplateColumns: "1.08fr .92fr", gap: "2rem", alignItems: "start" }}>
        <div>
          <SectionLabel text="About the lab" />
          <SectionTitle>AI & Computer Vision Laboratory</SectionTitle>
          <Divider />
          <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.85, marginBottom: "1rem" }}>
            The AI & Computer Vision Laboratory at the University of Peradeniya brings together research, supervision, and a small set of carefully maintained resources. The page design intentionally follows an institutional tone rather than a generic landing-page pattern.
          </p>
          <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.85, marginBottom: "1.5rem" }}>
            Our work spans foundational computer vision, autonomous systems, and practical AI deployments for healthcare and infrastructure analysis.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: ".9rem" }}>
            {highlights.map(({ title, desc, icon: Icon }) => (
              <Card key={title} style={{ padding: "1rem", borderTop: `3px solid ${T.gold}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: ".55rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{renderIcon(Icon, { size: 17 })}</div>
                  <div style={{ fontWeight: 700, color: T.navyDark }}>{title}</div>
                </div>
                <div style={{ color: T.textMid, fontSize: ".84rem", lineHeight: 1.65 }}>{desc}</div>
              </Card>
            ))}
          </div>
        </div>

        <Card style={{ padding: "1.25rem" }}>
          <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1rem" }}>Lab snapshot</div>
          {[["Publications", "47+"], ["Active projects", "12"], ["Researchers & students", "23"], ["GPU nodes", "8"], ["Equipment categories", "6"], ["Partner institutions", "3"]].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: ".9rem 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ color: T.textMid, fontSize: ".9rem" }}>{label}</span>
              <span style={{ color: T.navyDark, fontWeight: 700 }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: T.navyDark, fontWeight: 700, marginBottom: ".55rem" }}><LuMapPin size={15} /> Location</div>
            <div style={{ color: T.textMid, lineHeight: 1.75, fontSize: ".9rem" }}>
              Building D, Floor 3<br />Faculty of Engineering<br />University of Peradeniya<br />Peradeniya 20400, Sri Lanka
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
