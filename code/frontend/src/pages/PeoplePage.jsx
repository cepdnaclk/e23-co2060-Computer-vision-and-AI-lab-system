import { useState } from "react";
import { T } from "../styles/theme";
import { SectionLabel, SectionTitle, Divider } from "../components/UI";
import { PEOPLE } from "../data/labData";

export function PeoplePage() {
  const [tab, setTab] = useState("all");
  const shown = tab === "all" ? PEOPLE : PEOPLE.filter(p => p.type === tab);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <SectionLabel text="People" />
          <SectionTitle>Staff & Students</SectionTitle>
          <Divider />
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          {[["all","All"],["staff","Academic Staff"],["student","Students"]].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              style={{ padding: ".4rem 1rem", border: `1px solid ${tab === v ? T.navy : T.border}`, background: tab === v ? T.navy : "transparent", color: tab === v ? T.white : T.textMid, borderRadius: 2, fontWeight: 600, fontSize: ".8rem", fontFamily: "'Open Sans',sans-serif" }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "1.1rem" }}>
        {shown.map(m => (
          <div key={m.name} className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg,${T.navy},${T.navyLight})`, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto .85rem", fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: ".84rem" }}>
              {m.initials}
            </div>
            <div style={{ fontWeight: 700, fontSize: ".9rem", color: T.textDark, marginBottom: ".2rem" }}>{m.name}</div>
            <div style={{ color: T.navy, fontSize: ".75rem", fontWeight: 600, marginBottom: ".15rem" }}>{m.role}</div>
            <div style={{ color: T.textLight, fontSize: ".73rem", marginBottom: ".6rem" }}>{m.dept}</div>
            <span style={{ padding: "2px 8px", background: T.offWhite, border: `1px solid ${T.border}`, color: T.textMid, fontSize: ".69rem", borderRadius: 2 }}>
              {m.research}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
