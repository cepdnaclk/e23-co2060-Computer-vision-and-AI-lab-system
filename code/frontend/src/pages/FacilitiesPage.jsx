import { T } from "../styles/theme";
import { SectionLabel, SectionTitle, Divider } from "../components/UI";
import { EQUIPMENT } from "../data/labData";

export function FacilitiesPage({ setShowBooking }) {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <SectionLabel text="Facilities" />
      <SectionTitle>Equipment & Infrastructure</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, marginBottom: "2rem", fontSize: ".9rem", maxWidth: 680, lineHeight: 1.7 }}>
        All equipment is bookable through our internal reservation system. Registered lab members may request access via the portal or booking form.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(285px,1fr))", gap: "1.1rem" }}>
        {EQUIPMENT.map(eq => (
          <div key={eq.name} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
              <span style={{ fontSize: "1.75rem" }}>{eq.icon}</span>
              <span style={{ padding: "2px 8px", background: eq.avail ? `${T.green}18` : `${T.red}14`, color: eq.avail ? T.green : T.red, border: `1px solid ${eq.avail ? T.green + "40" : T.red + "30"}`, fontSize: ".69rem", fontWeight: 700, borderRadius: 2 }}>
                {eq.avail ? "Available" : "In Use"}
              </span>
            </div>
            <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".92rem", marginBottom: ".2rem" }}>{eq.name}</div>
            <div style={{ color: T.textMid, fontSize: ".82rem", marginBottom: ".35rem" }}>{eq.spec}</div>
            <div style={{ color: T.textLight, fontSize: ".75rem", marginBottom: "1rem" }}>Category: {eq.cat} · Fee: {eq.fee}</div>
            <button onClick={() => setShowBooking(true)} className="btn-outline" style={{ width: "100%", fontSize: ".8rem" }}>
              {eq.avail ? "Reserve Now" : "Join Waitlist"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
