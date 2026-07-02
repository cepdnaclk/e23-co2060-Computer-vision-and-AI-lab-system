import { T } from "../styles/theme";
import { Button, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { renderIcon } from "../components/iconUtils";
import { EQUIPMENT, ICONS } from "../data/labData";
import { LuArrowRight } from "react-icons/lu";

export function FacilitiesPage({ setShowBooking }) {
  return (
    <div className="page-shell section-padding">
      <SectionLabel text="Facilities" />
      <SectionTitle>Equipment and infrastructure</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.8, maxWidth: 760, marginBottom: "1.4rem" }}>
        The public site remains driven by the curated static list for now. Live equipment editing is available inside the authenticated internal area, where the backend requires a token.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {EQUIPMENT.map((equipment) => {
          const Icon = ICONS[equipment.iconKey];
          return (
            <Card key={equipment.name} style={{ padding: "1.2rem", borderTop: `3px solid ${equipment.avail ? T.success : T.warning}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", marginBottom: ".8rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{renderIcon(Icon, { size: 19 })}</div>
                <span style={{ padding: ".32rem .6rem", borderRadius: 999, background: equipment.avail ? `${T.success}12` : `${T.warning}12`, color: equipment.avail ? T.success : T.warning, border: `1px solid ${equipment.avail ? `${T.success}26` : `${T.warning}26`}`, fontSize: ".72rem", fontWeight: 700 }}>{equipment.avail ? "Available" : "In use"}</span>
              </div>
              <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".98rem" }}>{equipment.name}</div>
              <div style={{ color: T.textMid, fontSize: ".86rem", marginTop: ".35rem" }}>{equipment.spec}</div>
              <div style={{ color: T.textLight, fontSize: ".79rem", marginTop: ".35rem" }}>Category: {equipment.cat} · Fee: {equipment.fee}</div>
              <div style={{ marginTop: "1rem" }}>
                <Button variant="outline" icon={LuArrowRight} fullWidth onClick={() => setShowBooking(true)}>{equipment.avail ? "Book now" : "Join waitlist"}</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
