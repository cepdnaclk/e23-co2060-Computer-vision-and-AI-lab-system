import { T } from "../styles/theme";
import { SectionLabel, SectionTitle, Divider } from "../components/UI";
import { RESEARCH_AREAS } from "../data/labData";

export function ResearchPage() {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <SectionLabel text="Research" />
      <SectionTitle>Research Areas & Focus Groups</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, marginBottom: "2rem", fontSize: ".91rem", maxWidth: 680, lineHeight: 1.7 }}>
        Our work spans six core domains of computer vision and AI, with active collaboration across faculties and international partner institutions.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "1.25rem" }}>
        {RESEARCH_AREAS.map(r => (
          <div key={r.title} className="card ra-card" style={{ padding: "1.75rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".85rem" }}>{r.icon}</div>
            <h3 style={{ fontFamily: "'Noto Serif',serif", fontWeight: 700, fontSize: "1.05rem", color: T.navyDark, marginBottom: ".5rem" }}>{r.title}</h3>
            <p style={{ color: T.textMid, fontSize: ".85rem", lineHeight: 1.65 }}>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
