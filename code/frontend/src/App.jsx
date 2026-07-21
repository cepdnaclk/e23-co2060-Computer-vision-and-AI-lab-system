import { useState, useCallback } from "react";

// Styles
import { GLOBAL_CSS } from "./styles/theme";

// Layout
import { TopBar, LogoBar, MainNav, Breadcrumb, Footer } from "./components/Layout";

// Modals
import { BookingModal, LoginModal, RegisterModal } from "./components/Modals";

// Public pages
import { HomePage }        from "./pages/HomePage";
import { AboutPage }       from "./pages/AboutPage";
import { ResearchPage }    from "./pages/ResearchPage";
import { ProjectsPage }    from "./pages/ProjectsPage";
import { PublicationsPage} from "./pages/PublicationsPage";
import { PeoplePage }      from "./pages/PeoplePage";
import { FacilitiesPage }  from "./pages/FacilitiesPage";
import { NewsPage }        from "./pages/NewsPage";
import { ServicesPage }    from "./pages/ServicesPage";
import { ContactPage }     from "./pages/ContactPage";

// Portal
import { PortalSidebar, PortalHeader } from "./portal/PortalLayout";
import { StudentPortal } from "./portal/StudentPortal";
import { OfficerPortal } from "./portal/OfficerPortal";
import { StaffPortal }   from "./portal/StaffPortal";
import { AdminPortal }   from "./portal/AdminPortal";

// Valid roles the system recognises. Any other value (e.g. a stale remapped
// "admin" written by old code when the user was really an "officer") will
// force a fresh login so the correct portal is shown.
const VALID_ROLES = ["student", "officer", "staff", "admin"];

function getDefaultTab(role) {
  if (role === "student") return "history";
  if (role === "admin")   return "overview";
  if (role === "officer") return "booking-requests";
  return "dashboard";
}

function restoreSession() {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return { role: null, tab: "overview" };

    const parsedUser = JSON.parse(storedUser);
    const role = parsedUser.role;

    // Guard: if the stored role is not one of our known roles, wipe the
    // session so the user has to log in again with fresh data.
    if (!VALID_ROLES.includes(role)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { role: null, tab: "overview" };
    }

    return { role, tab: getDefaultTab(role) };
  } catch (error) {
    console.error("Failed to restore session", error);
    return { role: null, tab: "dashboard" };
  }
}

// ─────────────────────────────────────────────────────
// PUBLIC PAGE ROUTER
// ─────────────────────────────────────────────────────
function PublicPage({ section, setSection, setShowBooking, setShowLogin }) {
  const shared = { setSection, setShowBooking, setShowLogin };

  switch (section) {
    case "home":         return <HomePage        {...shared} />;
    case "about":        return <AboutPage />;
    case "research":     return <ResearchPage />;
    case "projects":     return <ProjectsPage />;
    case "publications": return <PublicationsPage />;
    case "people":       return <PeoplePage />;
    case "facilities":   return <FacilitiesPage  setShowBooking={setShowBooking} />;
    case "news":         return <NewsPage />;
    case "services":     return <ServicesPage    setShowBooking={setShowBooking} />;
    case "contact":      return <ContactPage />;
    default:             return <HomePage {...shared} />;
  }
}

function PortalContent({ role, active, setShowBooking }) {
  if (role === "student") return <StudentPortal active={active} setShowBooking={setShowBooking} />;
  if (role === "officer") return <OfficerPortal active={active} />;
  if (role === "staff")   return <StaffPortal   active={active} />;
  if (role === "admin")   return <AdminPortal   active={active} />;
  return null;
}

export default function App() {
  const initialSession = restoreSession();
  const [section,     setSection]     = useState("home");
  const [showBooking, setShowBooking] = useState(false);
  const [showLogin,   setShowLogin]   = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole,    setUserRole]    = useState(initialSession.role);
  const [portalTab,   setPortalTab]   = useState(initialSession.tab);

  const handleLogin  = useCallback(role => {
    setUserRole(role);
    if (role === "student") setPortalTab("history");
    else if (role === "admin") setPortalTab("overview");
    else if (role === "officer") setPortalTab("booking-requests");
    else setPortalTab("dashboard");
    setShowLogin(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserRole(null);
    setSection("home");
  }, []);

  if (userRole) {
    return (
      <div className="portal-container" style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        <style>{GLOBAL_CSS}</style>

        <PortalSidebar
          role={userRole}
          active={portalTab}
          setActive={setPortalTab}
          onLogout={handleLogout}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <PortalHeader role={userRole} />
          <main className="portal-main-content" style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
            <PortalContent
              role={userRole}
              active={portalTab}
              setShowBooking={setShowBooking}
            />
          </main>
        </div>

        {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{GLOBAL_CSS}</style>

      <TopBar  onLogin={() => setShowLogin(true)} />
      <LogoBar />
      <MainNav
        section={section}
        setSection={setSection}
        onBook={() => setShowLogin(true)}
      />
      <Breadcrumb section={section} />

      <main style={{ minHeight: "calc(100vh - 220px)" }}>
        <PublicPage
          section={section}
          setSection={setSection}
          setShowBooking={setShowBooking}
          setShowLogin={setShowLogin}
        />
      </main>

      <Footer />

      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onSuccess={() => setShowRegister(false)}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
}
