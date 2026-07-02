import { LuBuilding2, LuMail, LuPhone, LuLockKeyhole, LuArrowRight, LuHouse, LuMapPin, LuBookOpen, LuFlaskConical, LuUsers, LuCalendarClock, LuFileText, LuInfo, LuWrench, LuGraduationCap } from "react-icons/lu";
import { T } from "../styles/theme";
import labLogo from "../assets/lab-logo.png";
import { Button } from "./UI";
import { renderIcon } from "./iconUtils";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: LuHouse },
  { id: "about", label: "About", icon: LuInfo },
  { id: "research", label: "Research", icon: LuFlaskConical },
  { id: "projects", label: "Projects", icon: LuBookOpen },
  { id: "publications", label: "Publications", icon: LuFileText },
  { id: "people", label: "People", icon: LuUsers },
  { id: "facilities", label: "Facilities", icon: LuWrench },
  { id: "news", label: "News", icon: LuCalendarClock },
  { id: "services", label: "Services", icon: LuGraduationCap },
  { id: "contact", label: "Contact", icon: LuMail },
];

export function TopBar({ onLogin }) {
  return (
    <div style={{ background: T.navyDark }}>
      <div className="page-shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: ".45rem 0", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".8rem", flexWrap: "wrap" }}>
          <span className="topbar-link"><LuBuilding2 size={13} /> University of Peradeniya</span>
          <span style={{ color: "rgba(255,255,255,.18)" }}>•</span>
          <span className="topbar-link">Faculty of Engineering</span>
          <span style={{ color: "rgba(255,255,255,.18)" }}>•</span>
          <span className="topbar-link">Department of Computer Engineering</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".8rem", flexWrap: "wrap" }}>
          <a className="topbar-link" href="mailto:cvailab@pdn.ac.lk"><LuMail size={13} /> cvailab@pdn.ac.lk</a>
          <a className="topbar-link" href="tel:+94812389000"><LuPhone size={13} /> +94 81 238 9000</a>
          <Button variant="gold" size="sm" icon={LuLockKeyhole} onClick={onLogin}>Sign in</Button>
        </div>
      </div>
    </div>
  );
}

export function LogoBar() {
  return (
    <div style={{ background: `linear-gradient(180deg, ${T.navy} 0%, ${T.navyDark} 100%)`, borderBottom: `1px solid rgba(255,255,255,.08)` }}>
      <div className="page-shell" style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1rem 0", flexWrap: "wrap" }}>
        <div style={{ width: 68, height: 68, borderRadius: 999, background: "rgba(255,255,255,.96)", padding: 7, boxShadow: "0 18px 24px rgba(0,0,0,.12)" }}>
          <img src={labLogo} alt="CV & AI Lab" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 999 }} />
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: ".35rem" }}>Department of Computer Engineering</div>
          <div style={{ color: T.white, fontSize: "clamp(1.35rem, 2vw, 2rem)", fontWeight: 700, lineHeight: 1.05 }}>AI & Computer Vision Laboratory</div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: ".84rem", marginTop: ".35rem" }}>University of Peradeniya, Sri Lanka</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(88px, 1fr))", gap: ".65rem", width: "100%", maxWidth: 410 }}>
          {[["47+", "Publications"], ["12", "Active Projects"], ["23", "Researchers"]].map(([value, label]) => (
            <div key={label} className="hero-card" style={{ padding: ".8rem .95rem", borderRadius: 16, textAlign: "center" }}>
              <div style={{ color: T.gold, fontSize: "1.1rem", fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ color: "rgba(255,255,255,.7)", fontSize: ".7rem", marginTop: ".25rem" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MainNav({ section, setSection, onBook }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1200, background: "rgba(255,255,255,.88)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${T.border}` }}>
      <div className="page-shell" style={{ display: "flex", alignItems: "center", gap: ".15rem", overflowX: "auto" }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-btn${section === id ? " active" : ""}`} onClick={() => setSection(id)}>
            {renderIcon(Icon, { size: 15 })}
            {label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <Button variant="gold" size="sm" icon={LuArrowRight} onClick={onBook}>Book equipment</Button>
      </div>
    </div>
  );
}

export function Breadcrumb({ section }) {
  const LABELS = {
    about: "About",
    research: "Research Areas",
    projects: "Projects",
    publications: "Publications",
    people: "People",
    facilities: "Facilities",
    news: "News",
    services: "Services",
    contact: "Contact",
  };

  if (section === "home") return null;

  return (
    <div className="breadbar">
      <div className="page-shell" style={{ padding: ".7rem 0", display: "flex", alignItems: "center", gap: ".45rem" }}>
        <LuHouse size={13} />
        <span>Home</span>
        <span>•</span>
        <span style={{ color: T.navy, fontWeight: 600 }}>{LABELS[section] || section}</span>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: `linear-gradient(180deg, ${T.navyDark}, #101a31)`, color: "white", marginTop: "3rem" }}>
      <div className="page-shell" style={{ padding: "2.4rem 0 1.4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr .9fr .9fr", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 999, background: "rgba(255,255,255,.96)", padding: 4 }}>
                <img src={labLogo} alt="CV & AI Lab" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 999 }} />
              </div>
              <div>
                <div style={{ color: T.gold, fontSize: ".86rem", fontWeight: 700 }}>CV & AI Laboratory</div>
                <div style={{ color: "rgba(255,255,255,.62)", fontSize: ".75rem" }}>University of Peradeniya</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7, fontSize: ".9rem", maxWidth: 460 }}>
              A focused research lab advancing visual intelligence through rigorous methods, strong partnerships, and carefully maintained infrastructure.
            </p>
          </div>
          {[
            ["Quick Links", ["Home", "About", "Research", "Projects", "Publications", "People"]],
            ["Resources", ["Booking", "Services", "Facilities", "Research", "News"]],
            ["Contact", [
              { label: "Building D, Floor 3", icon: LuMapPin },
              { label: "cvailab@pdn.ac.lk", icon: LuMail },
              { label: "+94 81 238 9000", icon: LuPhone },
            ]],
          ].map(([title, items]) => (
            <div key={title}>
              <div style={{ color: T.gold, fontSize: ".74rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1rem" }}>{title}</div>
              {title === "Contact"
                ? items.map(({ label, icon: Icon }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "rgba(255,255,255,.72)", fontSize: ".88rem", marginBottom: ".5rem" }}>
                      {renderIcon(Icon, { size: 14 })}
                      <span>{label}</span>
                    </div>
                  ))
                : items.map((item) => (
                    <div key={item} style={{ color: "rgba(255,255,255,.72)", fontSize: ".88rem", marginBottom: ".45rem" }}>{item}</div>
                  ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginTop: "2rem", paddingTop: "1.1rem", borderTop: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.52)", fontSize: ".76rem" }}>
          <span>© 2025 AI & Computer Vision Laboratory, University of Peradeniya.</span>
          <span>Peradeniya 20400, Sri Lanka</span>
        </div>
      </div>
    </footer>
  );
}
