import { LuCheck, LuFlaskConical, LuGauge, LuMessageSquareMore, LuUsers } from "react-icons/lu";
import { T } from "../styles/theme";
import { Badge, Button, Card, PStat, PTable, PanelTitle } from "../components/UI";
import { ALL_RESERVATIONS } from "../data/labData";

function Dashboard() {
  const gpuNodes = [
    ["A100 Node 1", 85, "MedScan Training"],
    ["A100 Node 2", 72, "DroneVision Fine-tune"],
    ["A100 Node 3", 30, "EdgeVision Export"],
    ["HPC Cluster", 55, "CrowdFlow Inference"],
  ];
  const consultations = [
    ["Sarah Kim", "CV Methodology", "Mar 15"],
    ["Ravi Perera", "Dataset Advice", "Mar 16"],
    ["Nadia Hassan", "Model Selection", "Mar 18"],
  ];

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark }}>Staff dashboard</h2>
        <div style={{ color: T.textLight, fontSize: ".84rem", marginTop: ".2rem" }}>Dr. Anika Reyes · Lab Director · Senior Professor</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <PStat icon={LuMessageSquareMore} label="Pending consultations" value="5" sub="3 this week" color={T.warning} />
        <PStat icon={LuFlaskConical} label="Active projects" value="3" sub="Supervised" color={T.success} />
        <PStat icon={LuGauge} label="GPU queue" value="8" sub="2 running" color={T.navy} />
        <PStat icon={LuCheck} label="Reservations today" value="4" color={T.navyLight} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div>
          <PanelTitle>Pending consultation requests</PanelTitle>
          <div style={{ display: "grid", gap: ".7rem" }}>
            {consultations.map(([name, topic, date]) => (
              <Card key={name} style={{ padding: "1rem", display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: ".9rem", color: T.text }}>{name}</div>
                  <div style={{ color: T.textLight, fontSize: ".77rem", marginTop: ".2rem" }}>{topic} · {date}</div>
                </div>
                <div style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
                  <Button variant="primary" size="sm">Approve</Button>
                  <Button variant="danger" size="sm">Decline</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <PanelTitle>GPU usage monitor</PanelTitle>
          {gpuNodes.map(([node, pct, job]) => (
            <div key={node} style={{ marginBottom: ".9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: ".84rem", marginBottom: ".35rem" }}>
                <span><strong>{node}</strong> · <span style={{ color: T.textLight }}>{job}</span></span>
                <span style={{ fontWeight: 700, color: pct > 75 ? T.danger : pct > 50 ? T.warning : T.success }}>{pct}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: T.surfaceAlt, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: pct > 75 ? T.danger : pct > 50 ? T.warning : T.success }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConsultationRequests() {
  const rows = [
    ["Sarah Kim", "CV Methodology", "Mar 15, 2025", <Badge key="1" label="Pending" />],
    ["Ravi Perera", "Dataset Advice", "Mar 16, 2025", <Badge key="2" label="Approved" />],
    ["Nadia Hassan", "Model Selection", "Mar 18, 2025", <Badge key="3" label="Pending" />],
    ["Marcus Chen", "Publication Review", "Mar 22, 2025", <Badge key="4" label="Approved" />],
  ];
  return (
    <div className="fade-up">
      <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: "1.15rem" }}>Consultation requests</h2>
      <PTable cols={["Student", "Topic", "Date", "Status"]} rows={rows} />
    </div>
  );
}

function Reservations() {
  return (
    <div className="fade-up">
      <h2 style={{ margin: 0, fontSize: "1.35rem", color: T.navyDark, marginBottom: "1.15rem" }}>Equipment reservations</h2>
      <PTable cols={["ID", "User", "Resource", "Date", "Time", "Status"]} rows={ALL_RESERVATIONS.map((reservation) => [reservation.id, reservation.user, reservation.resource, reservation.date, reservation.time, <Badge key={reservation.id} label={reservation.status} />])} />
    </div>
  );
}

export function StaffPortal({ active }) {
  if (active === "dashboard") return <Dashboard />;
  if (active === "consults") return <ConsultationRequests />;
  if (active === "reservations") return <Reservations />;
  return <div style={{ padding: "1rem 0", color: T.textMid, fontSize: ".92rem" }}>Select a section from the sidebar.</div>;
}
