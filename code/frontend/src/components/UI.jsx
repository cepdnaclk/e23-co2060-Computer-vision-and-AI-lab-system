import { createPortal } from "react-dom";
import { T } from "../styles/theme";
import { renderIcon } from "./iconUtils";

const STATUS_TONES = {
  Approved: { bg: `${T.success}12`, color: T.success, border: `${T.success}26` },
  Pending: { bg: `${T.warning}12`, color: T.warning, border: `${T.warning}26` },
  Rejected: { bg: `${T.danger}12`, color: T.danger, border: `${T.danger}26` },
  Active: { bg: `${T.success}12`, color: T.success, border: `${T.success}26` },
  Completed: { bg: `${T.textLight}12`, color: T.textLight, border: `${T.textLight}26` },
};

export function Badge({ label, color, icon: Icon, tone }) {
  const toneStyle = STATUS_TONES[tone || label] || { bg: `${(color || T.navy)}12`, color: color || T.navy, border: `${(color || T.navy)}26` };
  return (
    <span className="badge" style={{ background: toneStyle.bg, color: toneStyle.color, borderColor: toneStyle.border }}>
      {Icon && <span style={{ display: "inline-flex" }}>{renderIcon(Icon, { size: 12, strokeWidth: 2.4 })}</span>}
      <span>{label}</span>
    </span>
  );
}

export function Button({ variant = "primary", size = "md", icon: Icon, iconPosition = "left", className = "", fullWidth = false, children, ...props }) {
  const classes = ["btn", `btn-${variant}`];
  if (size === "sm") classes.push("btn-sm");
  if (size === "lg") classes.push("btn-lg");
  if (className) classes.push(className);

  return (
    <button type={props.type || "button"} className={classes.join(" ")} style={fullWidth ? { width: "100%" } : undefined} {...props}>
      {Icon && iconPosition === "left" && renderIcon(Icon, { size: size === "sm" ? 14 : 16, strokeWidth: 2.1 })}
      <span>{children}</span>
      {Icon && iconPosition === "right" && renderIcon(Icon, { size: size === "sm" ? 14 : 16, strokeWidth: 2.1 })}
    </button>
  );
}

export function Card({ children, className = "", style, ...props }) {
  return <div className={["card", className].filter(Boolean).join(" ")} style={style} {...props}>{children}</div>;
}

export function Modal({ title, subtitle, onClose, children, maxWidth = 720, actions }) {
  const modal = (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="modal-shell" style={{ width: `min(100%, ${maxWidth}px)` }}>
        <div className="modal-header">
          <div>
            {title && <h3 className="modal-title">{title}</h3>}
            {subtitle && <div className="modal-subtitle">{subtitle}</div>}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className="modal-body">
          {children}
          {actions && <div style={{ marginTop: "1.25rem" }}>{actions}</div>}
        </div>
      </div>
    </div>
  );
  return typeof document !== "undefined" ? createPortal(modal, document.body) : modal;
}

export function Field({ label, type = "text", value, onChange, onKeyDown, options, rows, placeholder, icon: Icon, error, helperText, id, ...props }) {
  const control = { value: value ?? "", onChange: onChange || (() => {}), onKeyDown, placeholder, id, ...props };
  const controlClass = ["field-control", rows ? "field-control--textarea" : "", options ? "field-control--select" : "", Icon ? "has-icon" : ""].filter(Boolean).join(" ");

  return (
    <div className="field">
      {label && <label className="field-label" htmlFor={id}>{label}</label>}
      {options ? (
        <div className="field-wrap">
          {Icon && <span className="field-icon">{renderIcon(Icon, { size: 16, strokeWidth: 2 })}</span>}
          <select className={controlClass} {...control}>
            <option value="">Select an option</option>
            {options.map(option => {
              const opt = typeof option === "string" ? { value: option, label: option } : option;
              return <option key={opt.value} value={opt.value}>{opt.label}</option>;
            })}
          </select>
        </div>
      ) : rows ? (
        <div className="field-wrap">
          {Icon && <span className="field-icon">{renderIcon(Icon, { size: 16, strokeWidth: 2 })}</span>}
          <textarea className={controlClass} rows={rows} {...control} />
        </div>
      ) : (
        <div className="field-wrap">
          {Icon && <span className="field-icon">{renderIcon(Icon, { size: 16, strokeWidth: 2 })}</span>}
          <input type={type} className={controlClass} {...control} />
        </div>
      )}
      {helperText && !error && <div className="field-hint">{helperText}</div>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

export function SectionLabel({ text, children }) {
  return <div className="sec-chip">{text || children}</div>;
}

export function SectionTitle({ children }) {
  return <h2 className="sec-title">{children}</h2>;
}

export function Divider() {
  return <div className="sec-divider" />;
}

export function PTable({ cols, rows, onManage }) {
  return (
    <div className="surface" style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              {cols.map(c => <th key={c}>{c}</th>)}
              {onManage && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                {onManage && (
                  <td>
                    <Button variant="soft" size="sm" onClick={() => onManage(rowIndex)}>Manage</Button>
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

export function PStat({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color || T.navy}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: T.textLight, fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</div>
          <div className="serif" style={{ color: T.navyDark, fontSize: "1.8rem", fontWeight: 700, marginTop: ".35rem", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ color: T.textLight, fontSize: ".77rem", marginTop: ".35rem" }}>{sub}</div>}
        </div>
        {Icon && <span style={{ color: color || T.navy, display: "inline-flex" }}>{renderIcon(Icon, { size: 22, strokeWidth: 2 })}</span>}
      </div>
    </div>
  );
}

export function PanelTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: ".9rem" }}>
      <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: T.navyDark }}>{children}</div>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

export function QuickBtn({ icon: Icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="quick-card" style={{ width: "100%", display: "flex", alignItems: "center", gap: ".8rem", padding: "1rem 1.05rem", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, textAlign: "left" }}>
      {Icon && <span style={{ color: T.navy, display: "inline-flex" }}>{renderIcon(Icon, { size: 18, strokeWidth: 2 })}</span>}
      <span style={{ fontWeight: 600, color: T.navyDark, fontSize: ".9rem" }}>{label}</span>
    </button>
  );
}
