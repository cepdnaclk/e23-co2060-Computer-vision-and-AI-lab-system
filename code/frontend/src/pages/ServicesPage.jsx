import { T } from "../styles/theme";
import { SectionLabel, SectionTitle, Divider } from "../components/UI";
import { SERVICES } from "../data/labData";

export function ServicesPage({ setShowBooking }) {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <SectionLabel text="Services" />
      <SectionTitle>Lab Services & Access</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, marginBottom: "2rem", fontSize: ".9rem", lineHeight: 1.7 }}>
        Available to registered students, staff, and approved external collaborators. All requests are processed through the internal portal.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(275px,1fr))", gap: "1.25rem" }}>
        {SERVICES.map(s => (
          <div key={s.title} className="card" style={{ padding: "2rem", borderTop: `3px solid ${T.navy}` }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{s.icon}</div>
            <h3 style={{ fontFamily: "'Noto Serif',serif", fontWeight: 700, color: T.navyDark, marginBottom: ".5rem" }}>{s.title}</h3>
            <p style={{ color: T.textMid, fontSize: ".87rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>{s.desc}</p>
            <button onClick={() => setShowBooking(true)} className="btn-navy" style={{ width: "100%" }}>
              Request Access
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
