import { useState, useEffect } from "react";
import { T } from "../styles/theme";
import { Badge, PTable } from "../components/UI";
import { getItems, createItem, getBookings, updateBookingStatus } from "../services/api";

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

// ── Main Admin Portal ─────────────────────────────────
export function AdminPortal({ active }) {
  if (active === "reservations") return <ReservationApproval />;
  if (active === "equip-mgmt")   return <EquipmentManagement />;

  return <div style={{ padding: "2rem", color: T.textMid, fontSize: ".87rem" }}>Select a section from the sidebar.</div>;
}
