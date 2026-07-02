import { useState } from "react";
import { T } from "../styles/theme";
import { Badge, Button, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { PROJECTS } from "../data/labData";
import { LuChevronRight } from "react-icons/lu";

export function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((project) => project.status === filter);

  return (
    <div className="page-shell section-padding">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <SectionLabel text="Projects" />
          <SectionTitle>Research projects</SectionTitle>
          <Divider />
        </div>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          {["All", "Active", "Completed"].map((value) => (
            <Button key={value} variant={filter === value ? "primary" : "outline"} size="sm" onClick={() => setFilter(value)}>{value}</Button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {shown.map((project) => (
          <Card key={project.title} style={{ padding: "1.2rem", borderLeft: `4px solid ${project.status === "Active" ? T.success : T.textLight}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: "flex", gap: ".6rem", alignItems: "center", marginBottom: ".55rem", flexWrap: "wrap" }}>
                  <Badge label={project.status} />
                  <span style={{ color: T.textLight, fontSize: ".78rem" }}>{project.year}</span>
                </div>
                <h3 style={{ margin: 0, color: T.navyDark, fontSize: "1.12rem" }}>{project.title}</h3>
                <div style={{ color: T.textLight, fontSize: ".8rem", marginTop: ".25rem" }}>Lead: {project.lead}</div>
                <p style={{ color: T.textMid, fontSize: ".88rem", lineHeight: 1.7, marginTop: ".55rem", marginBottom: 0 }}>{project.desc}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", maxWidth: 180 }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ padding: ".28rem .55rem", borderRadius: 999, background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.navy, fontSize: ".72rem", fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: "1.25rem" }}>
        <Button variant="outline" icon={LuChevronRight}>Research pipeline</Button>
      </div>
    </div>
  );
}
