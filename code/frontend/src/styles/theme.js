export const T = {
  navyDark: "#1a2744",
  navy: "#1e3a6e",
  navyLight: "#2f4f8e",
  gold: "#c9a227",
  goldLight: "#d5b24d",
  white: "#ffffff",
  bg: "#f5f7fb",
  surface: "#ffffff",
  surfaceAlt: "#eef2f8",
  border: "#d9e0eb",
  borderStrong: "#c5cfdd",
  text: "#182235",
  textMid: "#44546b",
  textLight: "#6e7b92",
  success: "#1f7a47",
  danger: "#c2413b",
  warning: "#b45309",
  info: "#2563eb",
  shadowSm: "0 1px 2px rgba(16, 24, 40, 0.06)",
  shadowMd: "0 10px 30px rgba(16, 24, 40, 0.08)",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  :root {
    color-scheme: light;
    --navy-dark: ${T.navyDark};
    --navy: ${T.navy};
    --navy-light: ${T.navyLight};
    --gold: ${T.gold};
    --gold-light: ${T.goldLight};
    --bg: ${T.bg};
    --surface: ${T.surface};
    --surface-alt: ${T.surfaceAlt};
    --border: ${T.border};
    --border-strong: ${T.borderStrong};
    --text: ${T.text};
    --text-mid: ${T.textMid};
    --text-light: ${T.textLight};
    --success: ${T.success};
    --danger: ${T.danger};
    --warning: ${T.warning};
    --info: ${T.info};
    --shadow-sm: ${T.shadowSm};
    --shadow-md: ${T.shadowMd};
    --radius-lg: 20px;
    --radius-md: 14px;
    --radius-sm: 10px;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  img { max-width: 100%; display: block; }
  a { color: inherit; }
  button, input, select, textarea { font: inherit; }
  button { cursor: pointer; }
  ::selection { background: color-mix(in srgb, var(--gold) 32%, white); }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--navy) 30%, white); border-radius: 999px; border: 2px solid var(--bg); }
  ::-webkit-scrollbar-track { background: transparent; }

  h1, h2, h3, h4, h5, h6, .serif {
    font-family: 'Source Serif 4', serif;
    letter-spacing: -0.015em;
  }

  .page-shell {
    width: min(1240px, calc(100% - 2rem));
    margin: 0 auto;
  }

  .section-padding { padding: 2.5rem 0; }

  .surface,
  .card,
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .card,
  .panel,
  .ra-card,
  .news-card,
  .equip-card,
  .person-card,
  .stat-card,
  .quick-card,
  .contact-card,
  .portal-surface,
  .modal-surface {
    transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease, background-color .18s ease;
  }

  .card:hover,
  .panel:hover,
  .ra-card:hover,
  .news-card:hover,
  .equip-card:hover,
  .person-card:hover,
  .quick-card:hover,
  .contact-card:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-md);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .55rem;
    border-radius: 999px;
    border: 1px solid transparent;
    padding: .72rem 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease, border-color .16s ease, color .16s ease;
    text-decoration: none;
    line-height: 1;
    white-space: nowrap;
  }
  .btn:hover { transform: translateY(-1px); }
  .btn:disabled { cursor: not-allowed; opacity: .6; transform: none; }
  .btn-sm { padding: .56rem .85rem; font-size: .84rem; }
  .btn-lg { padding: .88rem 1.2rem; font-size: .96rem; }
  .btn-primary { background: var(--navy); color: white; box-shadow: 0 10px 18px rgba(30,58,110,.12); }
  .btn-primary:hover { background: var(--navy-light); }
  .btn-gold { background: var(--gold); color: #241a00; box-shadow: 0 10px 18px rgba(201,162,39,.16); }
  .btn-gold:hover { background: var(--gold-light); }
  .btn-outline { background: transparent; color: var(--navy); border-color: var(--border-strong); }
  .btn-outline:hover { background: color-mix(in srgb, var(--navy) 4%, white); border-color: var(--navy); }
  .btn-ghost { background: transparent; color: var(--text-mid); border-color: transparent; }
  .btn-ghost:hover { background: color-mix(in srgb, var(--navy) 4%, white); color: var(--navy); }
  .btn-danger { background: var(--danger); color: white; box-shadow: 0 10px 18px rgba(194,65,59,.12); }
  .btn-danger:hover { background: color-mix(in srgb, var(--danger) 85%, black); }
  .btn-soft { background: color-mix(in srgb, var(--navy) 4%, white); color: var(--navy); border-color: var(--border); }

  .sec-chip,
  .section-label {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding: .35rem .68rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--gold) 14%, white);
    color: color-mix(in srgb, var(--navy-dark) 86%, black);
    border: 1px solid color-mix(in srgb, var(--gold) 24%, white);
    font-size: .71rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: .65rem;
  }
  .sec-title,
  .section-title {
    margin: 0;
    font-size: clamp(1.7rem, 2.6vw, 2.6rem);
    line-height: 1.1;
    color: var(--navy-dark);
    font-weight: 700;
  }
  .sec-divider,
  .divider {
    width: 72px;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--gold), color-mix(in srgb, var(--gold) 55%, white));
    margin: .85rem 0 1.25rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding: .28rem .6rem;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 700;
    border: 1px solid transparent;
  }

  .field { display: grid; gap: .42rem; margin-bottom: 1rem; }
  .field-label { font-size: .82rem; font-weight: 600; color: var(--text-mid); letter-spacing: -0.01em; }
  .field-control {
    width: 100%;
    min-height: 46px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: white;
    color: var(--text);
    padding: .72rem .9rem;
    outline: none;
    box-shadow: 0 1px 1px rgba(16,24,40,.02) inset;
    transition: border-color .16s ease, box-shadow .16s ease, background-color .16s ease;
  }
  .field-control:focus {
    border-color: var(--navy);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--navy) 12%, white);
  }
  .field-control::placeholder { color: color-mix(in srgb, var(--text-light) 70%, white); }
  .field-control--textarea { resize: vertical; min-height: 112px; }
  .field-control--select { appearance: none; }
  .field-error { font-size: .76rem; color: var(--danger); }
  .field-hint { font-size: .76rem; color: var(--text-light); }
  .field-wrap { position: relative; }
  .field-icon {
    position: absolute;
    left: .9rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
    pointer-events: none;
  }
  .field-control.has-icon { padding-left: 2.5rem; }

  .dtable {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
  }
  .dtable thead th {
    background: linear-gradient(180deg, var(--navy-dark), var(--navy));
    color: white;
    text-align: left;
    font-size: .74rem;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: .92rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .dtable tbody td {
    padding: .9rem 1rem;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    vertical-align: top;
    font-size: .9rem;
    background: white;
  }
  .dtable tbody tr:hover td { background: color-mix(in srgb, var(--navy) 3%, white); }
  .dtable tbody tr:last-child td { border-bottom: none; }

  .topbar-link {
    color: color-mix(in srgb, white 72%, var(--navy-light));
    font-size: .76rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: .38rem;
    transition: color .16s ease;
  }
  .topbar-link:hover { color: var(--gold); }

  .nav-btn {
    display: inline-flex;
    align-items: center;
    gap: .45rem;
    padding: .9rem .95rem;
    border: none;
    background: transparent;
    color: var(--navy-dark);
    font-size: .86rem;
    font-weight: 600;
    border-bottom: 3px solid transparent;
    transition: color .16s ease, border-color .16s ease, background-color .16s ease;
  }
  .nav-btn:hover,
  .nav-btn.active { color: var(--navy); border-bottom-color: var(--gold); }

  .breadbar {
    background: color-mix(in srgb, var(--surface) 70%, var(--bg));
    border-bottom: 1px solid var(--border);
    color: var(--text-light);
    font-size: .76rem;
  }

  .ticker-track {
    display: inline-flex;
    gap: 2rem;
    white-space: nowrap;
    animation: ticker 24s linear infinite;
  }

  .hero-panel {
    background: linear-gradient(135deg, var(--navy-dark), var(--navy) 55%, var(--navy-light));
    color: white;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(24,34,53,.18);
  }
  .hero-card {
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(8px);
  }

  .modal-bg {
    position: fixed;
    inset: 0;
    z-index: 3000;
    background: rgba(7, 16, 34, .66);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .modal-shell {
    width: min(100%, 720px);
    max-height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,.12);
    box-shadow: 0 30px 80px rgba(7, 16, 34, .28);
    overflow: hidden;
  }
  .modal-header {
    background: linear-gradient(135deg, var(--navy-dark), var(--navy));
    color: white;
    padding: 1.15rem 1.35rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }
  .modal-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
  }
  .modal-subtitle {
    color: color-mix(in srgb, white 64%, var(--navy-light));
    margin-top: .25rem;
    font-size: .81rem;
  }
  .modal-close {
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.15);
    background: rgba(255,255,255,.08);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }
  .modal-body { padding: 1.25rem 1.35rem 1.4rem; overflow-y: auto; flex: 1; }

  .portal-sidebar {
    background: linear-gradient(180deg, var(--navy-dark), #14203a);
    color: white;
  }
  .sb-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .85rem 1rem;
    border: none;
    border-left: 3px solid transparent;
    background: transparent;
    color: color-mix(in srgb, white 68%, var(--navy-light));
    text-align: left;
    transition: background-color .16s ease, color .16s ease, border-color .16s ease;
  }
  .sb-btn:hover { background: rgba(255,255,255,.05); color: white; }
  .sb-btn.active { background: rgba(201,162,39,.11); color: white; border-left-color: var(--gold); }

  .stat-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow: var(--shadow-sm);
    padding: 1.15rem;
  }

  .quick-card { border-radius: 18px; }

  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp .4s ease both; }

  @media (max-width: 960px) {
    .portal-container { flex-direction: column !important; }

    /* Sidebar becomes a slim horizontal top bar */
    .portal-sidebar {
      width: 100% !important;
      height: auto !important;
      min-height: auto !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 50 !important;
      flex-direction: row !important;
      align-items: center !important;
    }

    /* Hide the logo/branding block and logout button on small screens */
    .portal-sidebar > div:first-child,
    .portal-sidebar > div:last-child { display: none !important; }

    /* Nav becomes a horizontal scrollable strip */
    .portal-sidebar nav {
      display: flex !important;
      overflow-x: auto !important;
      padding: 0 !important;
      flex: 1;
      -webkit-overflow-scrolling: touch;
    }
    .portal-sidebar nav::-webkit-scrollbar { display: none; }

    .sb-btn {
      border-left: 0 !important;
      border-bottom: 3px solid transparent !important;
      white-space: nowrap !important;
      padding: .75rem 1rem !important;
      flex-shrink: 0;
    }
    .sb-btn.active {
      border-bottom-color: var(--gold) !important;
      border-left-color: transparent !important;
    }
  }

  @media (max-width: 768px) {
    .page-shell { width: min(100%, calc(100% - 1rem)); }
    .nav-btn { padding: .8rem .75rem; }
    .hero-panel { border-radius: 20px; }
    .modal-shell { border-radius: 20px; }
    .dtable { min-width: 560px; }

    /* Reduce main padding on small screens */
    .portal-main-content { padding: 1rem !important; }

    /* Collapse user info in portal header — keep only avatar */
    .portal-header-userinfo { display: none !important; }
  }
`;
