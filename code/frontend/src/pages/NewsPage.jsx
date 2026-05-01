import { T } from "../styles/theme";
import { Badge, SectionLabel, SectionTitle, Divider } from "../components/UI";
import { NEWS_ITEMS } from "../data/labData";

export function NewsPage() {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <SectionLabel text="News & Events" />
      <SectionTitle>Latest Updates, Workshops & Seminars</SectionTitle>
      <Divider />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "1.1rem" }}>
        {NEWS_ITEMS.map(n => (
          <div key={n.title} className="card" style={{ padding: "1.5rem", borderTop: `3px solid ${T.gold}` }}>
            <div style={{ display: "flex", gap: ".6rem", alignItems: "center", marginBottom: ".75rem" }}>
              <Badge label={n.type} color={T.gold} />
              <span style={{ color: T.textLight, fontSize: ".72rem" }}>{n.date}</span>
            </div>
            <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".9rem", lineHeight: 1.4, marginBottom: ".5rem" }}>{n.title}</div>
            <div style={{ color: T.textMid, fontSize: ".82rem", lineHeight: 1.6 }}>{n.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
