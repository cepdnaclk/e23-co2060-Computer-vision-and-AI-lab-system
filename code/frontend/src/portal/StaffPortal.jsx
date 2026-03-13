import { T } from "../styles/theme";
import { Badge, PStat, PTable, PanelTitle } from "../components/UI";
import { ALL_RESERVATIONS } from "../data/labData";

// ── Dashboard ─────────────────────────────────────────
function Dashboard() {
  const gpuNodes = [
    ["A100 Node 1", 85, "MedScan Training"],
    ["A100 Node 2", 72, "DroneVision Fine-tune"],
    ["A100 Node 3", 30, "EdgeVision Export"],
    ["HPC Cluster",  55, "CrowdFlow Inference"],
  ];
  const consultations = [
    ["Sarah Kim",    "CV Methodology", "Mar 15"],
    ["Ravi Perera",  "Dataset Advice",  "Mar 16"],
    ["Nadia Hassan", "Model Selection", "Mar 18"],
  ];

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.4rem", fontWeight: 700, color: T.navyDark }}>Staff Dashboard</h2>
        <div style={{ color: T.textLight, fontSize: ".81rem" }}>Dr. Anika Reyes · Lab Director · Senior Professor</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <PStat icon="💬" label="Pending Consultations" value="5" sub="3 this week"  color={T.amber}    />
        <PStat icon="🔬" label="Active Projects"        value="3" sub="Supervised"   color={T.green}    />
        <PStat icon="⚡" label="GPU Queue"              value="8" sub="2 running"    color={T.navy}     />
        <PStat icon="📅" label="Reservations Today"     value="4"                   color={T.navyLight} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Consultation requests */}
        <div>
          <PanelTitle>Pending Consultation Requests</PanelTitle>
          <div style={{ display: "grid", gap: ".65rem" }}>
            {consultations.map(([name, topic, date]) => (
              <div key={name} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: ".85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: ".87rem" }}>{name}</div>
                  <div style={{ color: T.textLight, fontSize: ".74rem" }}>{topic} · {date}</div>
                </div>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <button style={{ padding: "3px 10px", background: `${T.green}14`, border: `1px solid ${T.green}40`, color: T.green, fontSize: ".71rem", fontWeight: 700, borderRadius: 2, fontFamily: "'Open Sans',sans-serif", cursor: "pointer" }}>Approve</button>
                  <button style={{ padding: "3px 10px", background: `${T.red}10`,  border: `1px solid ${T.red}30`,  color: T.red,   fontSize: ".71rem", fontWeight: 700, borderRadius: 2, fontFamily: "'Open Sans',sans-serif", cursor: "pointer" }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPU monitor */}
        <div>
          <PanelTitle>GPU Usage Monitor</PanelTitle>
          {gpuNodes.map(([node, pct, job]) => (
            <div key={node} style={{ marginBottom: ".85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".79rem", marginBottom: ".3rem" }}>
                <span><strong>{node}</strong> · <span style={{ color: T.textLight }}>{job}</span></span>
                <span style={{ fontWeight: 700, color: pct > 75 ? T.red : pct > 50 ? T.amber : T.green }}>{pct}%</span>
              </div>
              <div style={{ height: 7, borderRadius: 3, background: T.offWhite, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: pct > 75 ? T.red : pct > 50 ? T.amber : T.green, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Consultation Requests ─────────────────────────────
function ConsultationRequests() {
  const rows = [
    ["Sarah Kim",    "CV Methodology",    "Mar 15, 2025", <Badge label="Pending"  />],
    ["Ravi Perera",  "Dataset Advice",    "Mar 16, 2025", <Badge label="Approved" />],
    ["Nadia Hassan", "Model Selection",   "Mar 18, 2025", <Badge label="Pending"  />],
    ["Marcus Chen",  "Publication Review","Mar 22, 2025", <Badge label="Approved" />],
  ];
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>Consultation Requests</h2>
      <PTable cols={["Student","Topic","Date","Status"]} rows={rows} onManage={() => {}} />
    </div>
  );
}

// ── Equipment Reservations ────────────────────────────
function Reservations() {
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>Equipment Reservations</h2>
      <PTable cols={["ID","User","Resource","Date","Time","Status"]} rows={ALL_RESERVATIONS.map(r => [r.id, r.user, r.resource, r.date, r.time, <Badge label={r.status} />])} />
    </div>
  );
}

// ── Main Staff Portal ─────────────────────────────────
export function StaffPortal({ active }) {
  if (active === "dashboard")    return <Dashboard />;
  if (active === "consults")     return <ConsultationRequests />;
  if (active === "reservations") return <Reservations />;

  return <div style={{ padding: "2rem", color: T.textMid, fontSize: ".87rem" }}>Select a section from the sidebar.</div>;
}
