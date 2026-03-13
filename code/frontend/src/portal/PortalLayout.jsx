import { T } from "../styles/theme";
import { PORTAL_MENUS } from "../data/labData";

const ROLE_LABEL = { student: "Student Portal", staff: "Staff Portal", admin: "Admin Portal" };
const ROLE_COLOR = { student: "#3b82f6", staff: T.green, admin: T.gold };
const ROLE_INI   = { student: "SK", staff: "AR", admin: "AD" };
const ROLE_WHO   = { student: "Sarah Kim — PhD Candidate", staff: "Dr. Anika Reyes — Senior Staff", admin: "Lab Administrator" };

// ── Portal Sidebar ────────────────────────────────────
export function PortalSidebar({ role, active, setActive, onLogout }) {
  return (
    <div style={{ width: 232, flexShrink: 0, background: T.navyDark, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Sidebar header */}
      <div style={{ background: T.navy, padding: "1rem 1.2rem", borderBottom: `2px solid ${T.gold}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".4rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".85rem" }}>👁️</div>
          <div>
            <div style={{ color: T.gold, fontSize: ".64rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>CV & AI Lab</div>
            <div style={{ color: T.white, fontSize: ".81rem", fontWeight: 700 }}>{ROLE_LABEL[role]}</div>
          </div>
        </div>
        <div style={{ display: "inline-block", padding: "2px 8px", background: `${ROLE_COLOR[role]}25`, color: ROLE_COLOR[role], fontSize: ".67rem", fontWeight: 700, borderRadius: 2, textTransform: "uppercase", letterSpacing: ".06em" }}>
          {role}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, paddingTop: ".5rem" }}>
        {PORTAL_MENUS[role].map(m => (
          <button key={m.id} onClick={() => setActive(m.id)} className={`sb-btn${active === m.id ? " active" : ""}`}>
            <span style={{ fontSize: ".9rem" }}>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "1rem" }}>
        <button
          onClick={onLogout}
          style={{ width: "100%", padding: ".55rem", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "#8faac0", borderRadius: 2, fontSize: ".79rem", fontFamily: "'Open Sans',sans-serif", cursor: "pointer" }}
        >
          ← Return to Website
        </button>
      </div>
    </div>
  );
}

// ── Portal Top Header Bar ─────────────────────────────
export function PortalHeader({ role }) {
  return (
    <div style={{ background: T.white, borderBottom: `3px solid ${T.gold}`, padding: ".72rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
      <div style={{ fontSize: ".77rem", color: T.textLight }}>
        <span style={{ fontWeight: 700, color: T.navy }}>CV & AI Laboratory</span> · Internal Management System
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <span style={{ fontSize: ".77rem", color: T.textMid }}>{ROLE_WHO[role]}</span>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.navy, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".74rem", fontWeight: 700 }}>
          {ROLE_INI[role]}
        </div>
      </div>
    </div>
  );
}
