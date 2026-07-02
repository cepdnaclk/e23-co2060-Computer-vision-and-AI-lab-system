import { T } from "../styles/theme";
import { Button, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { renderIcon } from "../components/iconUtils";
import { ICONS, SERVICES } from "../data/labData";
import { LuArrowRight } from "react-icons/lu";

export function ServicesPage({ setShowBooking }) {
  return (
    <div className="page-shell section-padding">
      <SectionLabel text="Services" />
      <SectionTitle>Lab services and access</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.8, maxWidth: 760, marginBottom: "1.4rem" }}>
        Access is structured and intentionally modest. Requests are routed through the booking flow, with approval handled in the authenticated workspace.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
        {SERVICES.map((service) => {
          const Icon = ICONS[service.iconKey];
          return (
            <Card key={service.title} style={{ padding: "1.2rem", borderTop: `3px solid ${T.navy}` }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                {renderIcon(Icon, { size: 18 })}
              </div>
              <h3 style={{ margin: 0, color: T.navyDark, fontSize: "1.08rem" }}>{service.title}</h3>
              <p style={{ color: T.textMid, fontSize: ".88rem", lineHeight: 1.7, marginTop: ".55rem" }}>{service.desc}</p>
              <Button variant="primary" icon={LuArrowRight} fullWidth onClick={() => setShowBooking(true)}>Request access</Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
