export const T = {
  navyDark:  "#1a2744",
  navy:      "#1e3a6e",
  navyMid:   "#1e3566",
  navyLight: "#264a8a",
  gold:      "#c9a227",
  goldLight: "#e2b840",
  white:     "#ffffff",
  offWhite:  "#f4f6f9",
  border:    "#dde2ec",
  textDark:  "#1a2233",
  textMid:   "#4a5568",
  textLight: "#718096",
  green:     "#1a7a3c",
  red:       "#c0392b",
  amber:     "#b45309",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Open Sans', sans-serif; background: ${T.offWhite}; color: ${T.textDark}; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: ${T.navy}55; border-radius: 3px; }
  button { cursor: pointer; font-family: 'Open Sans', sans-serif; }
  input, select, textarea { font-family: 'Open Sans', sans-serif; }

  .topbar-link { color: #bfc8dc; font-size: 0.72rem; transition: color .2s; text-decoration: none; }
  .topbar-link:hover { color: ${T.gold}; }

  .nav-btn {
    padding: .85rem 1rem; background: none; border: none;
    border-bottom: 3px solid transparent; margin-bottom: -3px;
    font-size: .82rem; font-weight: 600; color: ${T.navyDark};
    white-space: nowrap; transition: color .2s, border-color .2s;
  }
  .nav-btn:hover { color: ${T.navy}; border-bottom-color: ${T.gold}; }
  .nav-btn.active { color: ${T.navy}; border-bottom-color: ${T.gold}; }

  .card {
    background: ${T.white}; border: 1px solid ${T.border}; border-radius: 4px;
    transition: box-shadow .25s, transform .25s;
  }
  .card:hover { box-shadow: 0 6px 24px rgba(30,58,110,.12); transform: translateY(-2px); }

  .btn-navy {
    background: ${T.navy}; color: ${T.white}; border: none;
    padding: .55rem 1.4rem; font-weight: 600; font-size: .83rem;
    border-radius: 3px; transition: background .2s, transform .15s;
  }
  .btn-navy:hover { background: ${T.navyLight}; transform: translateY(-1px); }

  .btn-gold {
    background: ${T.gold}; color: ${T.white}; border: none;
    padding: .55rem 1.4rem; font-weight: 600; font-size: .83rem;
    border-radius: 3px; transition: background .2s, transform .15s;
  }
  .btn-gold:hover { background: ${T.goldLight}; transform: translateY(-1px); }

  .btn-outline {
    background: transparent; color: ${T.navy};
    border: 1.5px solid ${T.navy}; padding: .5rem 1.3rem;
    font-weight: 600; font-size: .83rem; border-radius: 3px; transition: all .2s;
  }
  .btn-outline:hover { background: ${T.navy}; color: ${T.white}; }

  .btn-outline-white {
    background: transparent; color: ${T.white};
    border: 1.5px solid rgba(255,255,255,.45); padding: .55rem 1.4rem;
    font-weight: 600; font-size: .83rem; border-radius: 3px; transition: all .2s;
  }
  .btn-outline-white:hover { background: rgba(255,255,255,.12); }

  .sec-chip {
    display: inline-block; background: ${T.gold}; color: ${T.white};
    font-size: .68rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; padding: 3px 10px; margin-bottom: .5rem;
  }
  .sec-title {
    font-family: 'Noto Serif', serif; font-size: clamp(1.45rem, 2.2vw, 2rem);
    font-weight: 700; color: ${T.navyDark}; line-height: 1.25;
  }
  .sec-divider { width: 46px; height: 3px; background: ${T.gold}; margin: .7rem 0 1.25rem; }

  .dtable { width: 100%; border-collapse: collapse; }
  .dtable th {
    background: ${T.navyDark}; color: ${T.white}; padding: .6rem 1rem;
    text-align: left; font-size: .73rem; font-weight: 600; letter-spacing: .04em;
  }
  .dtable td { padding: .72rem 1rem; font-size: .84rem; border-bottom: 1px solid ${T.border}; }
  .dtable tr:hover td { background: #f0f4fb; }

  .sb-btn {
    display: flex; align-items: center; gap: .7rem;
    padding: .65rem 1.2rem; border: none; background: transparent;
    width: 100%; text-align: left; font-size: .83rem; color: #9ab0cc;
    border-left: 3px solid transparent; transition: all .2s;
  }
  .sb-btn:hover { background: rgba(255,255,255,.07); color: ${T.white}; }
  .sb-btn.active { background: rgba(255,255,255,.11); color: ${T.white}; border-left-color: ${T.gold}; }

  .inp {
    width: 100%; padding: .55rem .8rem; border: 1px solid ${T.border};
    border-radius: 3px; font-size: .87rem; color: ${T.textDark};
    outline: none; background: ${T.white};
  }
  .inp:focus { border-color: ${T.navy}; }
  .inp-label { display: block; font-size: .78rem; font-weight: 600; color: ${T.textMid}; margin-bottom: .3rem; }

  .badge { display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: .7rem; font-weight: 700; }

  @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
  .ticker-text { display: inline-block; white-space: nowrap; animation: ticker 26s linear infinite; }

  @keyframes slideIn { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
  .hero-content { animation: slideIn .55s ease; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp .45s ease forwards; }

  .modal-bg {
    position: fixed; inset: 0; background: rgba(10,20,50,.65);
    z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 1rem;
  }

  .qlink { transition: background .2s; }
  .qlink:hover { background: ${T.offWhite} !important; }

  .ra-card { border-top: 3px solid ${T.gold}; transition: box-shadow .25s, transform .25s, border-top-color .25s; }
  .ra-card:hover { box-shadow: 0 8px 28px rgba(30,58,110,.14); transform: translateY(-3px); border-top-color: ${T.navyLight}; }

  .breadbar { background: ${T.offWhite}; border-bottom: 1px solid ${T.border}; padding: .5rem 0; font-size: .77rem; color: ${T.textLight}; }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .portal-container { flex-direction: column !important; }
    .portal-sidebar { width: 100% !important; min-height: auto !important; }
    .portal-sidebar nav { display: flex; overflow-x: auto; padding-bottom: 0.5rem; }
    .sb-btn { white-space: nowrap; border-left: none !important; border-bottom: 3px solid transparent; }
    .sb-btn.active { border-bottom-color: ${T.gold} !important; }
    .dtable { min-width: 650px; }
  }
`;
