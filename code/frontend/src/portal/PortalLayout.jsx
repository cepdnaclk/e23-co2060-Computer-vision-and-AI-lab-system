import { LuLogOut, LuUser } from "react-icons/lu";
import { T } from "../styles/theme";
import { PORTAL_MENUS, ICONS } from "../data/labData";
import labLogo from "../assets/lab-logo.png";
import { Button } from "../components/UI";
import { renderIcon } from "../components/iconUtils";

const ROLE_LABEL = { student: "Student portal", staff: "Staff portal", admin: "Admin portal" };
const ROLE_COLOR = { student: T.info, staff: T.success, admin: T.gold };

function getInitials(name) {
  if (!name) return "??";
  return name.trim().split(/\s+/).map((word) => word[0].toUpperCase()).slice(0, 2).join("");
}

function getLoggedInUser() {
  try {
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);
  } catch {
    return null;
  }
  return null;
}

export function PortalSidebar({ role, active, setActive, onLogout }) {
  return (
    <div className="portal-sidebar" style={{ width: 250, flexShrink: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1rem 1.05rem", borderBottom: `1px solid rgba(255,255,255,.08)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".8rem" }}>
          <div style={{ width: 42, height: 42, borderRadius: 999, background: "rgba(255,255,255,.96)", padding: 4, flexShrink: 0 }}>
            <img src={labLogo} alt="CV & AI Lab" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 999 }} />
          </div>
          <div>
            <div style={{ color: T.gold, fontSize: ".68rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>CV & AI Lab</div>
            <div style={{ color: T.white, fontSize: ".94rem", fontWeight: 700 }}>{ROLE_LABEL[role]}</div>
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: ".45rem", padding: ".34rem .6rem", borderRadius: 999, background: `${ROLE_COLOR[role]}14`, color: ROLE_COLOR[role], fontSize: ".7rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
          {role}
        </div>
      </div>

      <nav style={{ padding: ".6rem 0", flex: 1 }}>
        {(PORTAL_MENUS[role] || []).map((menu) => {
          const Icon = ICONS[menu.iconKey];
          return (
            <button key={menu.id} type="button" onClick={() => setActive(menu.id)} className={`sb-btn${active === menu.id ? " active" : ""}`}>
              {renderIcon(Icon, { size: 16 })}
              <span>{menu.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "1rem" }}>
        <Button variant="ghost" fullWidth icon={LuLogOut} onClick={onLogout} style={{ color: "rgba(255,255,255,.82)", borderColor: "rgba(255,255,255,.1)" }}>
          Return to website
        </Button>
      </div>
    </div>
  );
}

export function PortalHeader() {
  const user = getLoggedInUser();
  const displayName = user?.name || "Unknown user";
  const initials = getInitials(user?.name);

  return (
    <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: ".85rem 1.35rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
      <div style={{ color: T.textLight, fontSize: ".82rem" }}>
        <span style={{ color: T.navyDark, fontWeight: 700 }}>CV & AI Laboratory</span> · Internal management system
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: T.text, fontWeight: 600, fontSize: ".9rem" }}>{displayName}</div>
          <div style={{ color: T.textLight, fontSize: ".75rem" }}>Authenticated session</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: T.navy, color: T.white, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: ".76rem", fontWeight: 700 }}>
          {initials || <LuUser size={18} />}
        </div>
      </div>
    </div>
  );
}
