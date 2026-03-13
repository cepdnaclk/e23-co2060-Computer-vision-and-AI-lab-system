import { T } from "../styles/theme";
import { SectionLabel, SectionTitle, Divider } from "../components/UI";

export function AboutPage() {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2.5rem", alignItems: "flex-start" }}>
        <div>
          <SectionLabel text="About the Lab" />
          <SectionTitle>AI & Computer Vision Laboratory</SectionTitle>
          <Divider />
          <p style={{ color: T.textMid, lineHeight: 1.8, marginBottom: "1rem", fontSize: ".91rem" }}>
            Established in 2018, the AI & CV Laboratory is a leading research centre within the Department of Computer Science at the Faculty of Engineering, University of Peradeniya.
          </p>
          <p style={{ color: T.textMid, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: ".91rem" }}>
            Our team combines world-class infrastructure with an interdisciplinary group of researchers pushing the boundaries of what machines can perceive and understand.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              ["🎯","Mission","Develop AI that perceives the visual world reliably and ethically."],
              ["🌍","Vision","A globally recognised centre of excellence in CV and applied AI."],
              ["🤝","Values","Open science, integrity, diversity, and collaborative excellence."],
              ["🏛️","Affiliation","Univ. of Peradeniya, Faculty of Engineering, Est. 2018."],
            ].map(([icon, t, d]) => (
              <div key={t} style={{ padding: "1rem", background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 3, borderLeft: `3px solid ${T.gold}` }}>
                <div style={{ fontSize: "1.25rem", marginBottom: ".3rem" }}>{icon}</div>
                <div style={{ fontWeight: 700, color: T.navy, fontSize: ".84rem", marginBottom: ".2rem" }}>{t}</div>
                <div style={{ color: T.textMid, fontSize: ".77rem", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ background: T.navy, color: T.white, padding: "1.5rem", borderRadius: 3, marginBottom: "1rem" }}>
            <div style={{ color: T.gold, fontWeight: 700, fontSize: ".77rem", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "1rem" }}>Lab at a Glance</div>
            {[["47+","Publications"],["12","Active Projects"],["23","Researchers & Students"],["8","GPU Nodes (A100)"],["6","Equipment Categories"],["3","Partner Institutions"]].map(([v, l]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgba(255,255,255,.1)", fontSize: ".83rem" }}>
                <span style={{ color: "rgba(255,255,255,.7)" }}>{l}</span>
                <span style={{ color: T.gold, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: T.offWhite, border: `1px solid ${T.border}`, padding: "1.25rem", borderRadius: 3, borderLeft: `3px solid ${T.gold}` }}>
            <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".84rem", marginBottom: ".6rem" }}>📍 Location</div>
            <div style={{ color: T.textMid, fontSize: ".82rem", lineHeight: 1.7 }}>
              Building D, Floor 3<br />Faculty of Engineering<br />University of Peradeniya<br />Peradeniya 20400, Sri Lanka
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
