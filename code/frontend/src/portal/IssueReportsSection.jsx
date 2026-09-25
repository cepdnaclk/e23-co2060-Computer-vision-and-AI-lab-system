import { useEffect, useState } from "react";
import { LuRefreshCcw, LuSave } from "react-icons/lu";
import { T } from "../styles/theme";
import { Badge, Button, Card, Field, PTable, SectionLabel, SectionTitle, Divider } from "../components/UI";
import { getIssueReports, updateIssueStatus } from "../services/api";

export function IssueReportsSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getIssueReports();
      setRows(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load issue reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (report, status, adminNotes) => {
    setSavingId(report.id);
    try {
      await updateIssueStatus(report.id, { status, adminNotes });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update issue report.");
    } finally {
      setSavingId(null);
    }
  };

  const reportRows = rows.map((report) => {
    const status = report.status || "Open";
    return [
      `#${report.id}`,
      <strong key={`equipment-${report.id}`} style={{ color: T.navyDark }}>{report.equipment_name}</strong>,
      <div key={`reporter-${report.id}`}>{report.reporter_name}<br /><span style={{ color: T.textLight, fontSize: ".78rem" }}>{report.reporter_email}</span></div>,
      report.issue_type,
      report.description,
      <Badge key={`urgency-${report.id}`} label={report.urgency} tone={report.urgency === "Urgent" ? "Rejected" : "Neutral"} />,
      <div key={`status-${report.id}`} style={{ minWidth: 170 }}>
        <Field value={status} onChange={(event) => setRows((current) => current.map((item) => item.id === report.id ? { ...item, status: event.target.value } : item))} options={["Open", "In Review", "Resolved", "Closed"]} />
        <Field value={report.admin_notes || ""} onChange={(event) => setRows((current) => current.map((item) => item.id === report.id ? { ...item, admin_notes: event.target.value } : item))} placeholder="Staff note..." />
        <Button variant="outline" size="sm" icon={LuSave} onClick={() => save(report, status, report.admin_notes)} disabled={savingId === report.id}>{savingId === report.id ? "Saving…" : "Save"}</Button>
      </div>,
    ];
  });

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div><SectionLabel text="Maintenance" /><SectionTitle>Issue reports</SectionTitle><Divider /><p style={{ margin: 0, color: T.textMid, lineHeight: 1.8, fontSize: ".94rem" }}>Review damage, loss, and hardware-fault reports linked to inventory records.</p></div>
        <Button variant="outline" icon={LuRefreshCcw} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button>
      </div>
      {error && <div role="alert" style={{ marginBottom: "1rem", padding: ".85rem .95rem", color: T.danger, background: `${T.danger}10`, border: `1px solid ${T.danger}26` }}>{error}</div>}
      {loading ? <Card style={{ padding: "1.2rem", color: T.textMid }}>Loading issue reports…</Card> : rows.length === 0 ? <Card style={{ padding: "1.4rem", color: T.textMid }}>No issue reports have been submitted.</Card> : <PTable cols={["ID", "Equipment", "Reported by", "Type", "Description", "Urgency", "Maintenance status"]} rows={reportRows} />}
    </div>
  );
}