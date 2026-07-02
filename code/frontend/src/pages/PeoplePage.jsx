import { useEffect, useMemo, useState } from "react";
import { T } from "../styles/theme";
import { Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { PEOPLE } from "../data/labData";
import { getPeople } from "../services/api";
import { LuUsers } from "react-icons/lu";

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function normalizePeople(rows) {
  return Array.isArray(rows) ? rows.map((person) => ({
    name: person.name,
    title: person.title || person.role,
    dept: person.dept,
    research: person.research,
    type: person.type,
    initials: initials(person.name),
  })) : [];
}

export function PeoplePage() {
  const [tab, setTab] = useState("all");
  const [people, setPeople] = useState(() => normalizePeople(PEOPLE));

  useEffect(() => {
    let cancelled = false;
    const loadPeople = async () => {
      try {
        const response = await getPeople();
        const rows = normalizePeople(response.data);
        if (!cancelled && rows.length > 0) setPeople(rows);
      } catch (error) {
        console.error("Failed to fetch people", error);
      }
    };
    loadPeople();
    return () => { cancelled = true; };
  }, []);

  const shown = useMemo(() => (tab === "all" ? people : people.filter((person) => person.type === tab)), [people, tab]);

  return (
    <div className="page-shell section-padding">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <SectionLabel text="People" />
          <SectionTitle>Staff and students</SectionTitle>
          <Divider />
        </div>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          {[ ["all", "All"], ["staff", "Staff"], ["student", "Students"] ].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setTab(value)} className="btn" style={{ borderRadius: 999, background: tab === value ? T.navy : T.surface, color: tab === value ? T.white : T.textMid, borderColor: tab === value ? T.navy : T.border }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {shown.map((person) => (
          <Card key={`${person.name}-${person.title}`} style={{ padding: "1.2rem", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, margin: "0 auto 1rem", background: `linear-gradient(135deg, ${T.navyDark}, ${T.navy})`, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".9rem", letterSpacing: ".04em" }}>{person.initials}</div>
            <div style={{ fontWeight: 700, color: T.text, fontSize: ".95rem" }}>{person.name}</div>
            <div style={{ color: T.navy, fontSize: ".78rem", fontWeight: 600, marginTop: ".2rem" }}>{person.title}</div>
            <div style={{ color: T.textLight, fontSize: ".78rem", marginTop: ".2rem" }}>{person.dept}</div>
            <div style={{ marginTop: ".8rem", padding: ".35rem .65rem", display: "inline-flex", alignItems: "center", gap: ".35rem", borderRadius: 999, background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.textMid, fontSize: ".72rem", fontWeight: 600 }}>
              <LuUsers size={12} /> {person.research}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
