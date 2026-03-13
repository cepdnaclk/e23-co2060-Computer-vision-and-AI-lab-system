import { useState, useEffect } from "react";
import { T } from "../styles/theme";
import { Badge, SectionLabel, SectionTitle, Divider } from "../components/UI";
import { RESEARCH_AREAS, PROJECTS, PUBLICATIONS, NEWS_ITEMS, SERVICES, HERO_SLIDES, TICKER_ITEMS } from "../data/labData";

// ── Hero Slider ───────────────────────────────────────
function HeroSlider({ setSection, setShowBooking }) {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => { setCur(c => (c + 1) % HERO_SLIDES.length); setKey(k => k + 1); }, 5200);
    return () => clearInterval(t);
  }, []);

  const go = i => { setCur(i); setKey(k => k + 1); };
  const s = HERO_SLIDES[cur];

  return (
    <div style={{ background: s.bg, minHeight: 380, display: "flex", alignItems: "center", position: "relative", overflow: "hidden", transition: "background .8s" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "3.5rem 1.5rem", flex: 1 }}>
        <div key={key} className="hero-content" style={{ maxWidth: 640 }}>
          <div style={{ display: "inline-block", background: T.gold, color: T.white, padding: "3px 12px", fontSize: ".69rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1rem" }}>{s.tag}</div>
          <h1 style={{ fontFamily: "'Noto Serif',serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", color: T.white, fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem" }}>{s.title}</h1>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".95rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 520 }}>{s.sub}</p>
          <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
            <button onClick={() => setSection("research")} className="btn-gold">
              {s.tag === "Research Excellence" ? "Explore Research →" : s.tag === "World-Class Infrastructure" ? "View Facilities →" : "Get Started →"}
            </button>
            <button onClick={() => setShowBooking(true)} className="btn-outline-white">Book Equipment</button>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "1.25rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: ".5rem" }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{ width: i === cur ? 24 : 8, height: 8, borderRadius: 4, background: i === cur ? T.gold : "rgba(255,255,255,.35)", border: "none", transition: "all .3s" }} />
        ))}
      </div>
    </div>
  );
}

// ── News Ticker ───────────────────────────────────────
function NewsTicker() {
  const text = TICKER_ITEMS.join("   ·   ");
  return (
    <div style={{ background: T.navyDark, borderTop: `2px solid ${T.gold}`, height: 34, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ background: T.gold, color: T.white, padding: "0 10px", fontSize: ".69rem", fontWeight: 700, letterSpacing: ".1em", whiteSpace: "nowrap", height: "100%", display: "flex", alignItems: "center", flexShrink: 0 }}>LATEST NEWS</div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div className="ticker-text" style={{ fontSize: ".77rem", color: "#c8d4e8" }}>{text}   {text}</div>
      </div>
    </div>
  );
}

// ── Quick Links Strip ─────────────────────────────────
function QuickLinks({ setShowBooking, setShowLogin }) {
  const links = [
    ["🎓", "Student Portal",   "Bookings, reservations & history",  "student"],
    ["👨‍🏫","Staff Portal",    "Projects, consultations & equipment","staff"  ],
    ["⚙️", "Admin Portal",    "Full lab management & administration","admin"  ],
    ["📅", "Book Equipment",  "Reserve GPU, drones, cameras & more","book"   ],
  ];
  return (
    <div style={{ background: T.white, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {links.map(([icon, title, desc, action]) => (
          <button
            key={title}
            onClick={() => action === "book" ? setShowBooking(true) : setShowLogin(true)}
            className="qlink"
            style={{ display: "flex", alignItems: "flex-start", gap: ".85rem", padding: "1.1rem 1.25rem", border: "none", borderRight: `1px solid ${T.border}`, background: T.white, textAlign: "left", fontFamily: "'Open Sans',sans-serif" }}
          >
            <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: 2 }}>{icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: T.navy, fontSize: ".88rem" }}>{title}</div>
              <div style={{ color: T.textLight, fontSize: ".74rem", marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── About Section ─────────────────────────────────────
function AboutSection({ setSection }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "2.5rem", alignItems: "flex-start" }}>
      <div>
        <SectionLabel text="About the Lab" />
        <SectionTitle>AI & Computer Vision Laboratory</SectionTitle>
        <Divider />
        <p style={{ color: T.textMid, lineHeight: 1.8, fontSize: ".9rem", marginBottom: "1rem" }}>
          Established in 2018 within the Department of Computer Science, Faculty of Engineering, the AI & CV Lab is dedicated to developing intelligent visual systems addressing real-world challenges in healthcare, autonomous navigation, and public safety.
        </p>
        <p style={{ color: T.textMid, lineHeight: 1.8, fontSize: ".9rem", marginBottom: "1.5rem" }}>
          Our interdisciplinary team of professors, PhD candidates, and research engineers leverages our world-class GPU cluster, drone fleet, and motion-capture system to push the frontiers of what machines can perceive and understand.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
          {[
            ["🎯","Mission","Develop AI systems that perceive the visual world reliably and ethically."],
            ["🌍","Vision","A globally recognised centre of excellence in CV and applied AI."],
            ["🤝","Collaboration","Open partnerships with industry, hospitals, and academia."],
            ["🏛️","Founded","2018, University of Peradeniya, Faculty of Engineering."],
          ].map(([icon, t, d]) => (
            <div key={t} style={{ padding: "1rem", background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, borderLeft: `3px solid ${T.gold}` }}>
              <div style={{ fontSize: "1.15rem", marginBottom: ".3rem" }}>{icon}</div>
              <div style={{ fontWeight: 700, color: T.navy, fontSize: ".83rem", marginBottom: ".2rem" }}>{t}</div>
              <div style={{ color: T.textMid, fontSize: ".76rem", lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setSection("about")} className="btn-navy" style={{ marginTop: "1.5rem" }}>Learn More →</button>
      </div>

      <div>
        <div style={{ background: T.navy, color: T.white, padding: "1.5rem", borderRadius: 3, marginBottom: "1rem" }}>
          <div style={{ color: T.gold, fontWeight: 700, fontSize: ".78rem", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "1rem" }}>Lab at a Glance</div>
          {[["47+","Publications"],["12","Active Research Projects"],["23","Researchers & Students"],["8","NVIDIA A100 GPU Nodes"],["6","Equipment Categories"],["3","International Partners"]].map(([v, l]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgba(255,255,255,.1)", fontSize: ".84rem" }}>
              <span style={{ color: "rgba(255,255,255,.7)" }}>{l}</span>
              <span style={{ color: T.gold, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: T.white, border: `1px solid ${T.border}`, padding: "1.25rem", borderRadius: 3, borderLeft: `3px solid ${T.gold}` }}>
          <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".84rem", marginBottom: ".6rem" }}>📍 Location</div>
          <div style={{ color: T.textMid, fontSize: ".82rem", lineHeight: 1.7 }}>Building D, Floor 3<br />Faculty of Engineering<br />University of Peradeniya<br />Peradeniya 20400, Sri Lanka</div>
        </div>
      </div>
    </div>
  );
}

// ── Research Areas Section ────────────────────────────
function ResearchSection({ setSection }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <SectionLabel text="Research Areas" />
          <SectionTitle>Core Research Domains</SectionTitle>
          <Divider />
        </div>
        <button onClick={() => setSection("research")} className="btn-outline" style={{ fontSize: ".8rem" }}>View All Research →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.1rem" }}>
        {RESEARCH_AREAS.map(r => (
          <div key={r.title} className="card ra-card" style={{ padding: "1.6rem", cursor: "default" }}>
            <div style={{ fontSize: "1.85rem", marginBottom: ".8rem" }}>{r.icon}</div>
            <h3 style={{ fontFamily: "'Noto Serif',serif", fontWeight: 700, fontSize: "1.02rem", color: T.navyDark, marginBottom: ".45rem" }}>{r.title}</h3>
            <p style={{ color: T.textMid, fontSize: ".84rem", lineHeight: 1.65 }}>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Services Band ─────────────────────────────────────
function ServicesBand({ setShowBooking }) {
  return (
    <div style={{ background: T.navy, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="sec-chip" style={{ background: "rgba(201,162,39,.9)" }}>Facilities & Services</div>
          <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "clamp(1.4rem,2vw,1.9rem)", color: T.white, fontWeight: 700, marginTop: ".5rem" }}>What We Offer</h2>
          <div style={{ width: 40, height: 3, background: T.gold, margin: ".75rem auto 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "1rem" }}>
          {SERVICES.map(s => (
            <div key={s.title} className="card" style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", padding: "1.5rem" }}>
              <div style={{ fontSize: "1.7rem", marginBottom: ".7rem" }}>{s.icon}</div>
              <div style={{ fontWeight: 700, color: T.gold, fontSize: ".91rem", marginBottom: ".4rem" }}>{s.title}</div>
              <div style={{ color: "rgba(255,255,255,.65)", fontSize: ".82rem", lineHeight: 1.6, marginBottom: "1rem" }}>{s.desc}</div>
              <button onClick={() => setShowBooking(true)} style={{ background: "transparent", border: `1px solid ${T.gold}60`, color: T.gold, padding: "4px 14px", fontSize: ".74rem", fontWeight: 600, borderRadius: 2, cursor: "pointer", fontFamily: "'Open Sans',sans-serif" }}>
                Request Access
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Projects Column ───────────────────────────────────
function ProjectsColumn({ setSection }) {
  return (
    <div>
      <SectionLabel text="Projects" /><SectionTitle>Current Research Projects</SectionTitle><Divider />
      {PROJECTS.filter(p => p.status === "Active").map(p => (
        <div key={p.title} style={{ display: "flex", gap: ".85rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ width: 4, flexShrink: 0, background: T.green, borderRadius: 2 }} />
          <div>
            <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginBottom: ".2rem" }}>
              <Badge label={p.status} /><span style={{ color: T.textLight, fontSize: ".72rem" }}>{p.year}</span>
            </div>
            <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".9rem" }}>{p.title}</div>
            <div style={{ color: T.textLight, fontSize: ".75rem" }}>Lead: {p.lead}</div>
            <div style={{ color: T.textMid, fontSize: ".8rem", marginTop: ".2rem", lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        </div>
      ))}
      <button onClick={() => setSection("projects")} className="btn-outline" style={{ fontSize: ".8rem" }}>View All Projects →</button>
    </div>
  );
}

// ── Publications Column ───────────────────────────────
function PublicationsColumn({ setSection }) {
  return (
    <div>
      <SectionLabel text="Publications" /><SectionTitle>Recent Research Papers</SectionTitle><Divider />
      {PUBLICATIONS.slice(0, 4).map(p => (
        <div key={p.title} style={{ display: "flex", gap: ".85rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ minWidth: 38, height: 38, background: T.navyDark, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, fontSize: ".68rem", fontWeight: 700, fontFamily: "'Roboto Mono',monospace", flexShrink: 0 }}>{p.year}</div>
          <div>
            <div style={{ fontWeight: 600, color: T.textDark, fontSize: ".84rem", lineHeight: 1.4 }}>
              {p.title}
              {p.award && <span style={{ marginLeft: ".4rem", background: T.gold, color: T.white, padding: "1px 5px", fontSize: ".64rem", fontWeight: 700, borderRadius: 2 }}>🏆 {p.award}</span>}
            </div>
            <div style={{ color: T.textLight, fontSize: ".74rem", marginTop: ".2rem" }}>{p.authors}</div>
            <div style={{ color: T.navyLight, fontSize: ".74rem", fontWeight: 600 }}>{p.venue}</div>
          </div>
        </div>
      ))}
      <button onClick={() => setSection("publications")} className="btn-outline" style={{ fontSize: ".8rem" }}>View All Publications →</button>
    </div>
  );
}

// ── News Section ──────────────────────────────────────
function NewsSection({ setSection }) {
  return (
    <div style={{ background: T.offWhite, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div><SectionLabel text="News & Events" /><SectionTitle>Latest Updates</SectionTitle><Divider /></div>
          <button onClick={() => setSection("news")} className="btn-outline" style={{ fontSize: ".8rem" }}>All News →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1rem" }}>
          {NEWS_ITEMS.map(n => (
            <div key={n.title} className="card" style={{ padding: "1.25rem", borderTop: `3px solid ${T.gold}` }}>
              <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginBottom: ".6rem" }}>
                <Badge label={n.type} color={T.gold} />
                <span style={{ color: T.textLight, fontSize: ".71rem" }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".88rem", lineHeight: 1.4, marginBottom: ".4rem" }}>{n.title}</div>
              <div style={{ color: T.textMid, fontSize: ".8rem", lineHeight: 1.55 }}>{n.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Portal CTA ────────────────────────────────────────
function PortalCTA({ setShowLogin }) {
  return (
    <div style={{ background: `linear-gradient(135deg,${T.navyDark},${T.navy})`, padding: "3rem 1.5rem", textAlign: "center" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: "1.75rem", color: T.white, fontWeight: 700, marginBottom: ".75rem" }}>Access the Lab Management Portal</h2>
        <p style={{ color: "#8faac0", marginBottom: "2rem", lineHeight: 1.65, fontSize: ".9rem" }}>Students, staff, and administrators can log in to manage bookings, track usage, and handle lab operations.</p>
        <button onClick={() => setShowLogin(true)} className="btn-gold" style={{ fontSize: ".95rem", padding: ".8rem 2.25rem" }}>Sign In to Portal →</button>
      </div>
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────
export function HomePage({ setSection, setShowBooking, setShowLogin }) {
  return (
    <div>
      <HeroSlider setSection={setSection} setShowBooking={setShowBooking} />
      <NewsTicker />
      <QuickLinks setShowBooking={setShowBooking} setShowLogin={setShowLogin} />

      {/* About + Research Areas block */}
      <div style={{ background: T.offWhite, padding: "3.5rem 1.5rem 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <AboutSection setSection={setSection} />
        </div>
      </div>
      <div style={{ background: T.offWhite, padding: "2.5rem 1.5rem 3.5rem" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <ResearchSection setSection={setSection} />
        </div>
      </div>

      {/* Services */}
      <ServicesBand setShowBooking={setShowBooking} />

      {/* Projects + Publications */}
      <div style={{ padding: "3rem 1.5rem", background: T.white }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          <ProjectsColumn setSection={setSection} />
          <PublicationsColumn setSection={setSection} />
        </div>
      </div>

      {/* News */}
      <NewsSection setSection={setSection} />

      {/* Portal CTA */}
      <PortalCTA setShowLogin={setShowLogin} />
    </div>
  );
}
