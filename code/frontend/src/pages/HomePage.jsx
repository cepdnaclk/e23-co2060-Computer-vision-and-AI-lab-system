import { useEffect, useMemo, useState } from "react";
import { LuArrowRight, LuCalendarClock, LuFlaskConical, LuUsers, LuWrench, LuBellRing, LuChevronRight } from "react-icons/lu";
import { T } from "../styles/theme";
import { Badge, Button, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { renderIcon } from "../components/iconUtils";
import { RESEARCH_AREAS, PROJECTS, PUBLICATIONS, NEWS_ITEMS, SERVICES, HERO_SLIDES, ICONS } from "../data/labData";
import { getNews } from "../services/api";

function formatNewsDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeNews(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return rows.map((row) => ({
    category: row.category || row.type || "News",
    title: row.title,
    content: row.content || row.desc || "",
    published_date: row.published_date || row.date,
  }));
}

function HeroSlider({ setSection, setShowBooking }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((value) => (value + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[slide];
  return (
    <div className="hero-panel" style={{ marginTop: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: "1.25rem", padding: "clamp(1.4rem, 3vw, 2.4rem)", alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 360 }}>
          <div className="sec-chip" style={{ alignSelf: "flex-start", background: "rgba(255,255,255,.1)", color: T.gold, borderColor: "rgba(255,255,255,.12)" }}>{current.tag}</div>
          <h1 style={{ margin: 0, fontSize: "clamp(2.2rem, 4vw, 3.8rem)", lineHeight: 1.02, color: T.white, maxWidth: 780 }}>University-grade research, built with discipline and clarity.</h1>
          <p style={{ margin: "1rem 0 0", color: "rgba(255,255,255,.76)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 620 }}>{current.sub}</p>
          <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <Button variant="gold" icon={LuArrowRight} onClick={() => setSection("research")}>Explore research</Button>
            <Button variant="outline" icon={LuCalendarClock} onClick={() => setShowBooking(true)} style={{ color: T.white, borderColor: "rgba(255,255,255,.22)" }}>Book equipment</Button>
          </div>
        </div>

        <Card className="hero-card" style={{ margin: "auto 0", background: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.12)", color: T.white, padding: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Lab at a glance</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: ".3rem" }}>A practical research environment</div>
            </div>
            <LuFlaskConical size={20} color={T.gold} />
          </div>
          <div style={{ display: "grid", gap: ".75rem" }}>
            {[
              ["Publications", "47+", LuBellRing],
              ["Researchers", "23", LuUsers],
              ["Facilities", "6", LuWrench],
            ].map(([label, value, Icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".9rem 1rem", borderRadius: 16, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)" }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,.68)", fontSize: ".74rem", fontWeight: 600 }}>{label}</div>
                  <div className="serif" style={{ fontSize: "1.6rem", fontWeight: 700, color: T.white, lineHeight: 1, marginTop: ".2rem" }}>{value}</div>
                </div>
                {renderIcon(Icon, { size: 19, color: T.gold })}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ display: "flex", gap: ".45rem", justifyContent: "center", padding: "0 0 1rem" }}>
        {HERO_SLIDES.map((_, index) => (
          <button key={index} type="button" onClick={() => setSlide(index)} style={{ width: slide === index ? 28 : 8, height: 8, borderRadius: 999, border: 0, background: slide === index ? T.gold : "rgba(255,255,255,.32)", transition: "all .2s ease" }} />
        ))}
      </div>
    </div>
  );
}

function QuickLinks({ setShowBooking, setShowLogin }) {
  const links = [
    { title: "Student portal", desc: "Bookings, history, and QR passes.", action: () => setShowLogin(true), icon: ICONS.studentPortal },
    { title: "Staff portal", desc: "Consultations, projects, and approvals.", action: () => setShowLogin(true), icon: ICONS.staffPortal },
    { title: "Admin portal", desc: "Reservations, people, news, and equipment.", action: () => setShowLogin(true), icon: ICONS.adminPortal },
    { title: "Book equipment", desc: "Reserve GPU, drones, cameras, and more.", action: () => setShowBooking(true), icon: ICONS.booking },
  ];

  return (
    <div className="section-padding">
      <div className="page-shell" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {links.map(({ title, desc, action, icon: Icon }) => (
          <Card key={title} className="quick-card" style={{ padding: "1.05rem 1.1rem", cursor: "pointer" }} onClick={action}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".8rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 14, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {renderIcon(Icon, { size: 18 })}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: T.navyDark, marginBottom: ".2rem" }}>{title}</div>
                <div style={{ color: T.textMid, fontSize: ".82rem", lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AboutSection({ setSection }) {
  const points = [
    { title: "Mission", desc: "Design AI systems that are reliable, understandable, and rooted in real lab workflows.", icon: ICONS.about },
    { title: "Focus", desc: "Computer vision, autonomous systems, and medical imaging with strong engineering discipline.", icon: ICONS.research },
    { title: "Environment", desc: "A curated teaching and research space with equipment, guidance, and administrative structure.", icon: ICONS.facilities },
    { title: "Collaboration", desc: "Open to students, faculty, and external partners working on serious applied AI projects.", icon: LuUsers },
  ];

  return (
    <div className="page-shell section-padding">
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: "2rem", alignItems: "start" }}>
        <div>
          <SectionLabel text="About the lab" />
          <SectionTitle>AI & Computer Vision Laboratory</SectionTitle>
          <Divider />
          <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.85, marginBottom: "1rem" }}>
            The AI & Computer Vision Laboratory at the University of Peradeniya is a focused academic environment for research, supervision, and applied experimentation. The lab combines a clear identity with practical infrastructure and a disciplined research culture.
          </p>
          <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.85, marginBottom: "1.5rem" }}>
            Our work spans foundational vision, robotics, and high-impact applied domains such as healthcare and infrastructure analytics.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: ".9rem" }}>
            {points.map(({ title, desc, icon: Icon }) => (
              <Card key={title} className="ra-card" style={{ padding: "1rem 1rem 1rem 1rem", borderTop: `3px solid ${T.gold}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: ".6rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{renderIcon(Icon, { size: 17 })}</div>
                  <div style={{ fontWeight: 700, color: T.navyDark }}>{title}</div>
                </div>
                <div style={{ color: T.textMid, fontSize: ".84rem", lineHeight: 1.6 }}>{desc}</div>
              </Card>
            ))}
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <Button variant="outline" icon={LuChevronRight} onClick={() => setSection("about")}>Read more about the lab</Button>
          </div>
        </div>
        <Card style={{ padding: "1.25rem" }}>
          <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1rem" }}>Lab snapshot</div>
          {[["Publications", "47+"], ["Active projects", "12"], ["Researchers & students", "23"], ["Equipment categories", "6"], ["Partner institutions", "3"]].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: ".9rem 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ color: T.textMid, fontSize: ".9rem" }}>{label}</span>
              <span style={{ color: T.navyDark, fontWeight: 700 }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: T.navyDark, fontWeight: 700, marginBottom: ".5rem" }}><ICONS.location size={15} /> Location</div>
            <div style={{ color: T.textMid, lineHeight: 1.75, fontSize: ".9rem" }}>
              Building D, Floor 3<br />Faculty of Engineering<br />University of Peradeniya<br />Peradeniya 20400, Sri Lanka
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ResearchSection({ setSection }) {
  return (
    <div className="page-shell section-padding">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <SectionLabel text="Research areas" />
          <SectionTitle>Core research domains</SectionTitle>
          <Divider />
        </div>
        <Button variant="outline" icon={LuChevronRight} onClick={() => setSection("research")}>View all research</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem" }}>
        {RESEARCH_AREAS.map((area) => {
          const Icon = ICONS[area.iconKey];
          return (
            <Card key={area.title} className="ra-card" style={{ padding: "1.25rem", borderTop: `3px solid ${T.gold}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${T.navy}10`, color: T.navy, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                {renderIcon(Icon, { size: 20 })}
              </div>
              <h3 style={{ margin: 0, fontSize: "1.12rem", color: T.navyDark }}>{area.title}</h3>
              <p style={{ margin: ".55rem 0 0", color: T.textMid, lineHeight: 1.7, fontSize: ".88rem" }}>{area.desc}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ServicesBand({ setShowBooking }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${T.navyDark}, ${T.navy})`, color: "white", padding: "3rem 0" }}>
      <div className="page-shell">
        <div style={{ textAlign: "center", marginBottom: "1.6rem" }}>
          <div className="sec-chip" style={{ background: "rgba(255,255,255,.08)", color: T.gold, borderColor: "rgba(255,255,255,.12)" }}>Facilities and services</div>
          <h2 style={{ margin: 0, fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)", color: T.white }}>What the lab provides</h2>
          <p style={{ maxWidth: 700, margin: ".7rem auto 0", color: "rgba(255,255,255,.72)", lineHeight: 1.7 }}>Structured access to hardware, consultation, and processing resources. Booking requests stay on record and go through staff review.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
          {SERVICES.map((service) => {
            const Icon = ICONS[service.iconKey];
            return (
              <Card key={service.title} style={{ padding: "1.2rem", background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.12)", color: T.white }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(255,255,255,.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  {renderIcon(Icon, { size: 19, color: T.gold })}
                </div>
                <div style={{ fontWeight: 700, color: T.gold, marginBottom: ".35rem" }}>{service.title}</div>
                <p style={{ margin: 0, color: "rgba(255,255,255,.72)", lineHeight: 1.65, fontSize: ".87rem" }}>{service.desc}</p>
                <div style={{ marginTop: "1rem" }}><Button variant="gold" size="sm" onClick={() => setShowBooking(true)}>Request access</Button></div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProjectsColumn({ setSection }) {
  return (
    <div>
      <SectionLabel text="Projects" />
      <SectionTitle>Active research projects</SectionTitle>
      <Divider />
      {PROJECTS.filter((project) => project.status === "Active").map((project) => (
        <div key={project.title} style={{ padding: "0 0 1rem", marginBottom: "1rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".45rem", flexWrap: "wrap" }}>
            <Badge label={project.status} />
            <span style={{ color: T.textLight, fontSize: ".78rem" }}>{project.year}</span>
          </div>
          <div style={{ fontWeight: 700, color: T.navyDark, fontSize: "1rem" }}>{project.title}</div>
          <div style={{ color: T.textLight, fontSize: ".8rem", marginTop: ".2rem" }}>Lead: {project.lead}</div>
          <p style={{ color: T.textMid, fontSize: ".87rem", lineHeight: 1.7, marginTop: ".5rem", marginBottom: 0 }}>{project.desc}</p>
        </div>
      ))}
      <Button variant="outline" icon={LuChevronRight} onClick={() => setSection("projects")}>Browse projects</Button>
    </div>
  );
}

function PublicationsColumn({ setSection }) {
  return (
    <div>
      <SectionLabel text="Publications" />
      <SectionTitle>Recent papers</SectionTitle>
      <Divider />
      {PUBLICATIONS.slice(0, 4).map((paper) => (
        <div key={paper.title} style={{ display: "grid", gridTemplateColumns: "58px 1fr", gap: ".8rem", paddingBottom: "1rem", marginBottom: "1rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ borderRadius: 14, background: T.navyDark, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 700, minHeight: 56 }}>{paper.year}</div>
          <div>
            <div style={{ fontWeight: 700, color: T.text, lineHeight: 1.5, fontSize: ".92rem" }}>{paper.title}{paper.award && <span style={{ marginLeft: ".45rem" }}><Badge label={paper.award} tone="Active" /></span>}</div>
            <div style={{ color: T.textLight, fontSize: ".78rem", marginTop: ".25rem" }}>{paper.authors}</div>
            <div style={{ color: T.navy, fontSize: ".78rem", fontWeight: 600 }}>{paper.venue}</div>
          </div>
        </div>
      ))}
      <Button variant="outline" icon={LuChevronRight} onClick={() => setSection("publications")}>Browse publications</Button>
    </div>
  );
}

function NewsSection({ setSection, news }) {
  return (
    <div style={{ background: T.surfaceAlt, padding: "3rem 0" }}>
      <div className="page-shell">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div>
            <SectionLabel text="News and events" />
            <SectionTitle>Latest updates</SectionTitle>
            <Divider />
          </div>
          <Button variant="outline" icon={LuChevronRight} onClick={() => setSection("news")}>All news</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
          {news.slice(0, 4).map((item) => (
            <Card key={item.title} className="news-card" style={{ padding: "1.1rem", borderTop: `3px solid ${T.gold}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".75rem", flexWrap: "wrap" }}>
                <Badge label={item.category || item.type || "News"} tone="Pending" />
                <span style={{ color: T.textLight, fontSize: ".77rem" }}>{formatNewsDate(item.published_date || item.date)}</span>
              </div>
              <div style={{ fontWeight: 700, color: T.navyDark, lineHeight: 1.5 }}>{item.title}</div>
              <p style={{ color: T.textMid, lineHeight: 1.65, fontSize: ".86rem", marginBottom: 0 }}>{item.content || item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsTicker({ news }) {
  const items = (news.length ? news : NEWS_ITEMS).map((item) => item.title || item.desc || "Latest update");
  const tickerItems = [...items, ...items];
  return (
    <div style={{ background: T.navyDark, color: "white", borderTop: `1px solid rgba(255,255,255,.08)`, overflow: "hidden" }}>
      <div className="page-shell" style={{ display: "flex", alignItems: "center", gap: "1rem", minHeight: 42, overflow: "hidden" }}>
        <div style={{ color: T.gold, fontSize: ".72rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", flexShrink: 0 }}>Latest</div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="ticker-track" style={{ color: "rgba(255,255,255,.75)", fontSize: ".84rem" }}>
            {tickerItems.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePage({ setSection, setShowBooking, setShowLogin }) {
  const [news, setNews] = useState(NEWS_ITEMS);

  useEffect(() => {
    let cancelled = false;
    const fetchNews = async () => {
      try {
        const response = await getNews();
        const rows = normalizeNews(response.data);
        if (!cancelled && rows.length > 0) setNews(rows);
      } catch (error) {
        console.error("Failed to load news", error);
      }
    };
    fetchNews();
    return () => { cancelled = true; };
  }, []);

  const tickerSource = useMemo(() => news.length ? news : NEWS_ITEMS, [news]);

  return (
    <>
      <div className="section-padding">
        <div className="page-shell">
          <HeroSlider setSection={setSection} setShowBooking={setShowBooking} />
        </div>
      </div>
      <QuickLinks setShowBooking={setShowBooking} setShowLogin={setShowLogin} />
      <AboutSection setSection={setSection} />
      <ResearchSection setSection={setSection} />
      <div className="section-padding">
        <div className="page-shell" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <ProjectsColumn setSection={setSection} />
          <PublicationsColumn setSection={setSection} />
        </div>
      </div>
      <ServicesBand setShowBooking={setShowBooking} />
      <NewsSection setSection={setSection} news={tickerSource} />
      <NewsTicker news={tickerSource} />
    </>
  );
}
