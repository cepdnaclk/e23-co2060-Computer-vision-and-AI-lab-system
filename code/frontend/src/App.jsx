import { useState, useCallback, useEffect } from "react";

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
import { StaffPortal }   from "./portal/StaffPortal";
import { AdminPortal }   from "./portal/AdminPortal";

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

// ─────────────────────────────────────────────────────
// PORTAL CONTENT ROUTER
// ─────────────────────────────────────────────────────
function PortalContent({ role, active, setShowBooking }) {
  if (role === "student") return <StudentPortal active={active} setShowBooking={setShowBooking} />;
  if (role === "staff")   return <StaffPortal   active={active} />;
  if (role === "admin")   return <AdminPortal   active={active} />;
  return null;
}

// ─────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────
export default function App() {
  const [section,     setSection]     = useState("home");
  const [showBooking, setShowBooking] = useState(false);
  const [showLogin,   setShowLogin]   = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole,    setUserRole]    = useState(null);   // null = public website
  const [portalTab,   setPortalTab]   = useState("dashboard");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Translate "officer" back to "admin" for the frontend menus
        const role = parsedUser.role === "officer" ? "admin" : parsedUser.role;
        setUserRole(role);
      } catch (error) {
        console.error("Failed to restore session", error);
      }
    }
  }, []);

  const handleLogin  = useCallback(role => {
    setUserRole(role);
    setPortalTab("dashboard");
    setShowLogin(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token"); // Destroy the token
    localStorage.removeItem("user");  // Destroy the user data
    setUserRole(null);                // Reset React state
    setSection("home");
  }, []);

  // ── PORTAL VIEW ──────────────────────────────────────
  if (userRole) {
    return (
      <div className="portal-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
        <style>{GLOBAL_CSS}</style>

        <PortalSidebar
          role={userRole}
          active={portalTab}
          setActive={setPortalTab}
          onLogout={handleLogout}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>
          <PortalHeader role={userRole} />
          <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
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

  // ── PUBLIC WEBSITE VIEW ──────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      <style>{GLOBAL_CSS}</style>

      <TopBar  onLogin={() => setShowLogin(true)} />
      <LogoBar />
      <MainNav
        section={section}
        setSection={setSection}
        onBook={() => setShowBooking(true)}
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
