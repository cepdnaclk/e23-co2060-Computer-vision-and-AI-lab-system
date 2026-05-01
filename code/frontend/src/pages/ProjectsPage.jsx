import { useState } from "react";
import { T } from "../styles/theme";
import { Badge, SectionLabel, SectionTitle, Divider } from "../components/UI";
import { PROJECTS } from "../data/labData";

export function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.status === filter);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <SectionLabel text="Projects" />
          <SectionTitle>Research Projects</SectionTitle>
          <Divider />
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          {["All", "Active", "Completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ padding: ".4rem 1rem", border: `1px solid ${filter === f ? T.navy : T.border}`, background: filter === f ? T.navy : "transparent", color: filter === f ? T.white : T.textMid, borderRadius: 2, fontWeight: 600, fontSize: ".8rem", fontFamily: "'Open Sans',sans-serif" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {shown.map(p => (
          <div key={p.title} className="card" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start", borderLeft: `4px solid ${p.status === "Active" ? T.green : T.textLight}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: ".6rem", alignItems: "center", marginBottom: ".5rem", flexWrap: "wrap" }}>
                <Badge label={p.status} />
                <span style={{ color: T.textLight, fontSize: ".74rem" }}>{p.year}</span>
              </div>
              <h3 style={{ fontFamily: "'Noto Serif',serif", fontWeight: 700, fontSize: "1.05rem", color: T.navyDark, marginBottom: ".2rem" }}>{p.title}</h3>
              <div style={{ color: T.textLight, fontSize: ".77rem", marginBottom: ".5rem" }}>Lead: {p.lead}</div>
              <p style={{ color: T.textMid, fontSize: ".85rem", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", maxWidth: 150, paddingTop: "1.8rem" }}>
              {p.tags.map(t => (
                <span key={t} style={{ padding: "2px 7px", background: T.offWhite, border: `1px solid ${T.border}`, color: T.navy, fontSize: ".71rem", fontWeight: 600, borderRadius: 2 }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
