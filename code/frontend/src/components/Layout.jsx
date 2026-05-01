import { T } from "../styles/theme";

// ── Top Utility Bar ───────────────────────────────────
export function TopBar({ onLogin }) {
  return (
    <div style={{ background: T.navyDark, padding: ".42rem 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
          {["University of Peradeniya", "Faculty of Engineering", "Dept. of Computer Engineering"].map((l, i) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
              {i > 0 && <span style={{ color: "#ffffff30" }}>|</span>}
              <a href="#" className="topbar-link">{l}</a>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
          <a href="mailto:cvailab@pdn.ac.lk" className="topbar-link">📧 cvailab@pdn.ac.lk</a>
          <span style={{ color: "#ffffff30" }}>|</span>
          <a href="tel:+94812389000" className="topbar-link">📞 +94 81 238 9000</a>
          <span style={{ color: "#ffffff30" }}>|</span>
          <button
            onClick={onLogin}
            style={{ background: T.gold, color: T.white, border: "none", padding: "3px 12px", borderRadius: 2, fontSize: ".71rem", fontWeight: 700 }}
          >
            🔐 Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Logo / Branding Bar ───────────────────────────────
export function LogoBar() {
  return (
    <div style={{ background: T.navy, padding: ".85rem 1.5rem" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>
          👁️
        </div>
        <div>
          <div style={{ color: T.gold, fontSize: ".67rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
            Dept. of Computer Engineering · Faculty of Engineering
          </div>
          <div style={{ color: T.white, fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.2 }}>
            AI & Computer Vision Laboratory
          </div>
          <div style={{ color: "#8faac0", fontSize: ".71rem" }}>University of Peradeniya, Sri Lanka</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex" }}>
          {[["47+","Publications"],["12","Active Projects"],["23","Researchers"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center", padding: ".4rem .9rem", borderLeft: "1px solid rgba(255,255,255,.15)" }}>
              <div style={{ color: T.gold, fontFamily: "'Noto Serif',serif", fontSize: "1.3rem", fontWeight: 700, lineHeight: 1 }}>{v}</div>
              <div style={{ color: "#8faac0", fontSize: ".64rem", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Navigation Bar ───────────────────────────────
export function MainNav({ section, setSection, onBook }) {
  const links = [
    ["home","Home"], ["about","About"], ["research","Research"], ["projects","Projects"],
    ["publications","Publications"], ["people","People"], ["facilities","Facilities"],
    ["news","News & Events"], ["services","Services"], ["contact","Contact"],
  ];
  return (
    <div style={{ background: T.white, borderBottom: `3px solid ${T.gold}`, boxShadow: "0 2px 8px rgba(0,0,0,.07)", position: "sticky", top: 0, zIndex: 200 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", overflowX: "auto" }}>
        {links.map(([id, label]) => (
          <button key={id} onClick={() => setSection(id)} className={`nav-btn${section === id ? " active" : ""}`}>
            {label}
          </button>
        ))}
        <button onClick={onBook} className="btn-gold" style={{ marginLeft: "auto", flexShrink: 0, fontSize: ".8rem", padding: ".5rem 1.1rem" }}>
          Book Equipment
        </button>
      </div>
    </div>
  );
}

// ── Breadcrumb Bar ────────────────────────────────────
export function Breadcrumb({ section }) {
  const LABELS = {
    about:"About", research:"Research Areas", projects:"Projects",
    publications:"Publications", people:"People", facilities:"Facilities & Equipment",
    news:"News & Events", services:"Services", contact:"Contact Us",
  };
  if (section === "home") return null;
  return (
    <div className="breadbar">
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 1.5rem" }}>
        🏠 Home <span style={{ margin: "0 .4rem" }}>/</span>
        <span style={{ color: T.navy, fontWeight: 600 }}>{LABELS[section] || section}</span>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ background: T.navyDark, padding: "2.5rem 1.5rem 1.5rem" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>

          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>👁️</div>
              <div>
                <div style={{ color: T.gold, fontFamily: "'Noto Serif',serif", fontWeight: 700, fontSize: ".94rem" }}>CV & AI Laboratory</div>
                <div style={{ color: "#8faac0", fontSize: ".67rem" }}>University of Peradeniya</div>
              </div>
            </div>
            <p style={{ color: "#8faac0", fontSize: ".79rem", lineHeight: 1.7, marginBottom: "1rem" }}>
              Dept. of Computer Engineering, Faculty of Engineering. Advancing visual intelligence through research, innovation, and collaboration.
            </p>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {["LinkedIn","GitHub","Google Scholar","ResearchGate"].map(s => (
                <span key={s} style={{ padding: "3px 10px", border: "1px solid rgba(255,255,255,.15)", color: "#8faac0", fontSize: ".67rem", borderRadius: 2, cursor: "pointer" }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            ["Quick Links", ["Home","About","Research","Projects","Publications","People"]],
            ["Resources",   ["Equipment Booking","GPU Request","Consultation","Lab Portal","PhD Applications"]],
            ["Contact",     ["Building D, Floor 3","Faculty of Engineering","Univ. of Peradeniya","cvailab@pdn.ac.lk","+94 81 238 9000"]],
          ].map(([title, items]) => (
            <div key={title}>
              <div style={{ color: T.gold, fontWeight: 700, fontSize: ".77rem", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".85rem", borderBottom: `1px solid rgba(201,162,39,.3)`, paddingBottom: ".4rem" }}>{title}</div>
              {items.map(i => (
                <div key={i} style={{ color: "#8faac0", fontSize: ".77rem", marginBottom: ".35rem", cursor: "pointer" }}>{i}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: ".5rem" }}>
          <span style={{ color: "#5a6a84", fontSize: ".72rem" }}>© 2025 AI & Computer Vision Laboratory, University of Peradeniya. All rights reserved.</span>
          <span style={{ color: "#5a6a84", fontSize: ".72rem" }}>Peradeniya 20400, Sri Lanka</span>
        </div>
      </div>
    </footer>
  );
}
