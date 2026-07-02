import { T } from "../styles/theme";
import { Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { renderIcon } from "../components/iconUtils";
import { RESEARCH_AREAS, ICONS } from "../data/labData";

export function ResearchPage() {
  return (
    <div className="page-shell section-padding">
      <SectionLabel text="Research" />
      <SectionTitle>Research areas and focus groups</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.8, maxWidth: 760, marginBottom: "1.5rem" }}>
        The lab works across six core domains. The emphasis is on clear methods, repeatable experiments, and a restrained institutional visual language.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {RESEARCH_AREAS.map((area) => {
          const Icon = ICONS[area.iconKey];
          return (
            <Card key={area.title} style={{ padding: "1.25rem", borderTop: `3px solid ${T.gold}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                {renderIcon(Icon, { size: 20 })}
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: T.navyDark }}>{area.title}</h3>
              <p style={{ margin: ".55rem 0 0", color: T.textMid, lineHeight: 1.7, fontSize: ".88rem" }}>{area.desc}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
