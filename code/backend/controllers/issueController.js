const pool = require("../config/db");

const createIssue = async (req, res) => {
    try {
        const { equipmentId, issueType, description, urgency } = req.body;
        if (!equipmentId || !issueType || !description || !String(description).trim()) {
            return res.status(400).json({ message: "Equipment, issue type, and description are required" });
        }
        if (!["Damage", "Hardware fault", "Loss"].includes(issueType)) {
            return res.status(400).json({ message: "Invalid issue type" });
        }
        if (urgency && !["Low", "Normal", "Urgent"].includes(urgency)) {
            return res.status(400).json({ message: "Invalid urgency" });
        }

        const equipment = await pool.query("SELECT id FROM inventory WHERE id = $1", [equipmentId]);
        if (!equipment.rows.length) return res.status(404).json({ message: "Equipment not found" });

        const result = await pool.query(
            `INSERT INTO equipment_issue_reports
             (inventory_id, reported_by, issue_type, description, urgency)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [equipmentId, req.user.id, issueType, description.trim(), urgency || "Normal"]
        );
        res.status(201).json({ message: "Issue report submitted", report: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting issue report" });
    }
};

const getIssues = async (req, res) => {
    try {
        const mine = req.query?.mine === "true";
        const query = `
            SELECT r.*, i.name AS equipment_name, u.name AS reporter_name, u.email AS reporter_email
            FROM equipment_issue_reports r
            JOIN inventory i ON i.id = r.inventory_id
            JOIN users u ON u.id = r.reported_by
            ${mine || !["officer", "admin"].includes(req.user.role) ? "WHERE r.reported_by = $1" : ""}
            ORDER BY r.created_at DESC`;
        const result = await pool.query(query, mine || !["officer", "admin"].includes(req.user.role) ? [req.user.id] : []);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching issue reports" });
    }
};

const updateIssueStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        if (!["Open", "In Review", "Resolved", "Closed"].includes(status)) {
            return res.status(400).json({ message: "Invalid issue status" });
        }
        const result = await pool.query(
            `UPDATE equipment_issue_reports
             SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [status, adminNotes || null, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ message: "Issue report not found" });
        res.json({ message: "Issue report updated", report: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating issue report" });
    }
};

module.exports = { createIssue, getIssues, updateIssueStatus };