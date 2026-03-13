import { T } from "../styles/theme";

// ── Badge ─────────────────────────────────────────────
export function Badge({ label, color }) {
  const COLOR_MAP = {
    Approved: T.green, Pending: T.amber, Rejected: T.red,
    Active: T.green, Completed: T.textLight,
  };
  const c = COLOR_MAP[label] || color || T.navy;
  return (
    <span
      className="badge"
      style={{ background: `${c}18`, color: c, border: `1px solid ${c}30` }}
    >
      {label}
    </span>
  );
}

// ── Form Field ────────────────────────────────────────
export function Field({ label, type = "text", value, onChange, options, rows, placeholder }) {
  const s = {
    width: "100%", padding: ".55rem .8rem",
    border: `1px solid ${T.border}`, borderRadius: 3,
    fontSize: ".87rem", color: T.textDark, outline: "none", background: T.white,
  };
  return (
    <div style={{ marginBottom: ".9rem" }}>
      {label && <label className="inp-label">{label}</label>}
      {options ? (
        <select value={value} onChange={onChange} style={s}>
          <option value="">-- Select --</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : rows ? (
        <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} style={{ ...s, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={s} />
      )}
    </div>
  );
}

// ── Section Helpers ───────────────────────────────────
export function SectionLabel({ text }) {
  return <div className="sec-chip">{text}</div>;
}

export function SectionTitle({ children }) {
  return <h2 className="sec-title">{children}</h2>;
}

export function Divider() {
  return <div className="sec-divider" />;
}

// ── Portal Data Table ─────────────────────────────────
export function PTable({ cols, rows, onManage }) {
  return (
    <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              {cols.map(c => <th key={c}>{c}</th>)}
              {onManage && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => <td key={j}>{c}</td>)}
                {onManage && (
                  <td>
                    <button
                      onClick={() => onManage(i)}
                      style={{ padding: "3px 10px", background: T.offWhite, border: `1px solid ${T.border}`, color: T.navy, fontSize: ".74rem", fontWeight: 600, borderRadius: 2, fontFamily: "'Open Sans',sans-serif", cursor: "pointer" }}
                    >
                      Manage
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Portal Stat Card ──────────────────────────────────
export function PStat({ icon, label, value, sub, color }) {
  const borderColor = color || T.navy;
  return (
    <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, padding: "1.2rem", borderTop: `3px solid ${borderColor}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: T.textLight, fontSize: ".71rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>{label}</div>
          <div style={{ color: T.textDark, fontSize: "1.55rem", fontWeight: 800, fontFamily: "'Noto Serif',serif", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ color: T.textLight, fontSize: ".73rem", marginTop: ".25rem" }}>{sub}</div>}
        </div>
        <span style={{ fontSize: "1.45rem" }}>{icon}</span>
      </div>
    </div>
  );
}

// ── Portal Panel Title ────────────────────────────────
export function PanelTitle({ children }) {
  return (
    <div style={{ fontWeight: 700, color: T.navyDark, fontSize: ".87rem", marginBottom: ".75rem", paddingBottom: ".5rem", borderBottom: `2px solid ${T.gold}` }}>
      {children}
    </div>
  );
}

// ── Quick Action Button ───────────────────────────────
export function QuickBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".82rem 1rem", background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, width: "100%", textAlign: "left", fontFamily: "'Open Sans',sans-serif", cursor: "pointer", transition: "all .2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.navy; e.currentTarget.style.background = T.offWhite; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.white; }}
    >
      <span style={{ fontSize: "1.05rem" }}>{icon}</span>
      <span style={{ fontWeight: 600, color: T.navy, fontSize: ".83rem" }}>{label}</span>
    </button>
  );
}
