import { useState, useEffect } from "react";
import { T } from "../styles/theme";
import { Badge, PStat, PTable, PanelTitle } from "../components/UI";
import { EQUIPMENT, PEOPLE, NEWS_ITEMS, ALL_RESERVATIONS } from "../data/labData";
import { getItems, createItem, getBookings, updateBookingStatus } from "../services/api";

// ── Dashboard ─────────────────────────────────────────
function Dashboard() {
  const pending = ALL_RESERVATIONS.filter(r => r.status === "Pending");

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.4rem", fontWeight: 700, color: T.navyDark }}>Admin Overview</h2>
        <div style={{ color: T.textLight, fontSize: ".81rem" }}>Lab Administrator · Full Access</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <PStat icon="👥" label="Total Users"       value="42"      sub="28 students, 14 staff" color={T.navy}  />
        <PStat icon="📅" label="Pending Approvals" value="12"      sub="5 equip, 7 GPU"        color={T.amber} />
        <PStat icon="⚡" label="GPU Utilisation"   value="68%"     sub="Across 8 nodes"        color={T.green} />
        <PStat icon="💳" label="Fees This Month"   value="LKR 84k" sub="+12% vs last month"    color={T.gold}  />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.5rem" }}>
        <div>
          <PanelTitle>Pending Reservation Approvals</PanelTitle>
          <PTable cols={["User","Resource","Date","Status"]} rows={pending.map(r => [r.user, r.resource, r.date, <Badge label={r.status} />])} onManage={() => {}} />
        </div>
        <div>
          <PanelTitle>Equipment Status</PanelTitle>
          <div style={{ display: "grid", gap: ".5rem" }}>
            {EQUIPMENT.map(eq => (
              <div key={eq.name} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: ".65rem .85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: ".83rem", fontWeight: 500 }}>{eq.icon} {eq.name}</span>
                <span style={{ padding: "2px 7px", background: eq.avail ? `${T.green}15` : `${T.red}12`, color: eq.avail ? T.green : T.red, border: `1px solid ${eq.avail ? T.green + "35" : T.red + "25"}`, fontSize: ".68rem", fontWeight: 700, borderRadius: 2 }}>
                  {eq.avail ? "Available" : "In Use"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── User Management ───────────────────────────────────
function UserManagement() {
  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark }}>User Management</h2>
        <button className="btn-navy">+ Add User</button>
      </div>
      <PTable
        cols={["Name","Role","Department","Email","Status"]}
        rows={PEOPLE.map(p => [p.name, p.role, p.dept, `${p.initials.toLowerCase()}@pdn.ac.lk`, <Badge label="Active" color={T.green} />])}
        onManage={() => {}}
      />
    </div>
  );
}

// ── Reservation Approval ──────────────────────────────
function ReservationApproval() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all bookings from PostgreSQL
  const fetchReservations = async () => {
    try {
      const response = await getBookings();
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to load reservations", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Handle clicking Approve or Reject
  const handleAction = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      fetchReservations(); // Refresh the table instantly
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating booking. Check console.");
    }
  };

  if (isLoading) {
    return <div className="fade-up" style={{ padding: "2rem", color: T.textMid }}>Loading live reservations...</div>;
  }

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>Reservation Approval</h2>
      
      <PTable
        cols={["ID", "User", "Resource", "Date", "Time", "Status", "Actions"]}
        rows={reservations.map(r => {
          // Setup badge colors
          let badgeColor = T.amber;
          if (r.status === "Approved") badgeColor = T.green;
          if (r.status === "Rejected") badgeColor = T.red;

          return [
            `R-${r.id}`, 
            r.user_name || "Student", 
            r.resource, 
            new Date(r.booking_date).toLocaleDateString(), 
            r.time_slot, 
            <Badge key={`badge-${r.id}`} label={r.status} color={badgeColor} />,
            
            // The Action Buttons
            <div key={`action-${r.id}`} style={{ display: "flex", gap: "0.5rem" }}>
              {r.status === "Pending" ? (
                <>
                  <button onClick={() => handleAction(r.id, "Approved")} style={{ padding: "4px 8px", background: T.green, color: "white", border: "none", borderRadius: "3px", fontSize: "0.75rem", cursor: "pointer", fontWeight: "bold" }}>✓ Approve</button>
                  <button onClick={() => handleAction(r.id, "Rejected")} style={{ padding: "4px 8px", background: T.red, color: "white", border: "none", borderRadius: "3px", fontSize: "0.75rem", cursor: "pointer", fontWeight: "bold" }}>✕ Reject</button>
                </>
              ) : (
                <span style={{ fontSize: "0.75rem", color: T.textLight }}>Processed</span>
              )}
            </div>
          ];
        })}
        onManage={() => {}}
      />
    </div>
  );
}

// ── GPU Workload ──────────────────────────────────────
function GpuWorkload() {
  const nodes = [
    ["A100 Node 1", 85, "MedScan Training",      "Sarah Kim"  ],
    ["A100 Node 2", 72, "DroneVision Fine-tune",  "Ravi Perera"],
    ["A100 Node 3", 30, "EdgeVision Export",      "Marcus Chen"],
    ["A100 Node 4",  0, "Idle",                   "—"          ],
    ["HPC Cluster",  55, "CrowdFlow Inference",   "Sarah Kim"  ],
  ];
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1.25rem" }}>GPU Workload Management</h2>
      <div style={{ display: "grid", gap: ".85rem" }}>
        {nodes.map(([node, pct, job, user]) => (
          <div key={node} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: "1.1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".6rem" }}>
              <div>
                <strong style={{ fontSize: ".88rem" }}>{node}</strong>
                <span style={{ color: T.textLight, fontSize: ".8rem", marginLeft: ".5rem" }}>· {job}</span>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontSize: ".77rem", color: T.textLight }}>User: <strong style={{ color: T.textDark }}>{user}</strong></span>
                <span style={{ fontWeight: 700, color: pct > 75 ? T.red : pct > 40 ? T.amber : pct === 0 ? T.textLight : T.green, fontSize: ".9rem" }}>{pct}%</span>
                {pct > 0 && (
                  <button style={{ padding: "3px 8px", background: `${T.red}12`, border: `1px solid ${T.red}30`, color: T.red, fontSize: ".7rem", fontWeight: 700, borderRadius: 2, fontFamily: "'Open Sans',sans-serif", cursor: "pointer" }}>Stop</button>
                )}
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 3, background: T.offWhite }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: pct > 75 ? T.red : pct > 40 ? T.amber : pct === 0 ? T.border : T.green, transition: "width 1s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Fee & Payments ────────────────────────────────────
function FeePayments() {
  const rows = [
    ["Sarah Kim",   "GPU Cluster",  "2h",      "LKR 1,000", <Badge label="Approved" color={T.green} />,                                                                  "Mar 12"],
    ["Marcus Chen", "Drone Fleet",  "Session", "LKR 800",   <Badge label="Pending"  color={T.amber} />,                                                                  "Mar 12"],
    ["Priya Nair",  "Camera Array", "2h",      "LKR 600",   <Badge label="Approved" color={T.green} />,                                                                  "Mar 13"],
    ["Ravi Perera", "HPC Server",   "2h",      "LKR 800",   <span style={{ padding:"2px 7px", background:"#f0f0f0", color:T.textLight, fontSize:".69rem", fontWeight:700, borderRadius:2 }}>Waived</span>, "Mar 14"],
  ];
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark, marginBottom: "1rem" }}>Fee & Payment Tracking</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <PStat icon="💳" label="Total Collected" value="LKR 84.2k" color={T.green} />
        <PStat icon="⏳" label="Pending"          value="LKR 12.4k" color={T.amber} />
        <PStat icon="📊" label="Transactions"     value="38"         color={T.navy}  />
        <PStat icon="🏆" label="Top Resource"     value="GPU Cluster" color={T.gold} />
      </div>
      <PTable cols={["User","Resource","Duration","Fee","Payment","Date"]} rows={rows} />
    </div>
  );
}

// ── Equipment Management ──────────────────────────────
function EquipmentManagement() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // We pull this out into its own function so we can call it when the page loads, 
  // AND after we add a new item to refresh the list!
  const fetchInventory = async () => {
    try {
      const response = await getItems();
      setInventory(response.data);
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 1. ADD THIS NEW FUNCTION TO TEST DATABASE WRITES
  const handleAddTestItem = async () => {
    try {
      // This is the mock data we will send to PostgreSQL
      const testItem = {
        name: `Test Drone ${Math.floor(Math.random() * 1000)}`, // Adds a random number so you can click it multiple times
        category: "Drone",
        description: "Added via the React Frontend!"
      };
      
      // Send to the backend
      await createItem(testItem);
      
      // If successful, immediately fetch the updated list from the database
      await fetchInventory(); 
      
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Check the console!");
    }
  };

  if (isLoading) {
    return <div className="fade-up" style={{ padding: "2rem", color: T.textMid }}>Loading live equipment data...</div>;
  }

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark }}>Equipment Management</h2>
        

      </div>
      
      <PTable
        cols={["Equipment Name", "Category", "Description", "Status"]}
        rows={inventory.map(item => [
          <strong key={`name-${item.id}`}>{item.name}</strong>, 
          item.category, 
          item.description,
          <span key={`status-${item.id}`} style={{ padding:"2px 7px", background: `${T.green}15`, color: T.green, border:`1px solid ${T.green}35`, fontSize:".68rem", fontWeight:700, borderRadius:2 }}>
            Available
          </span>
        ])}
        onManage={() => {}}
      />
    </div>
  );
}

// ── News Management ───────────────────────────────────
function NewsManagement() {
  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, color: T.navyDark }}>News & Events Management</h2>
        <button className="btn-navy">+ New Post</button>
      </div>
      <PTable
        cols={["Title","Type","Date","Status"]}
        rows={NEWS_ITEMS.map(n => [n.title, <Badge label={n.type} color={T.gold} />, n.date, <Badge label="Published" color={T.green} />])}
        onManage={() => {}}
      />
    </div>
  );
}

// ── Main Admin Portal ─────────────────────────────────
export function AdminPortal({ active }) {
  if (active === "dashboard")    return <Dashboard />;
  if (active === "users")        return <UserManagement />;
  if (active === "reservations") return <ReservationApproval />;
  if (active === "gpu-mgmt")     return <GpuWorkload />;
  if (active === "fees")         return <FeePayments />;
  if (active === "equip-mgmt")   return <EquipmentManagement />;
  if (active === "news-mgmt")    return <NewsManagement />;

  return <div style={{ padding: "2rem", color: T.textMid, fontSize: ".87rem" }}>Select a section from the sidebar.</div>;
}
