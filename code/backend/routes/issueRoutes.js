const express = require("express");
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus } = require("../controllers/issueController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);
router.get("/", getIssues);
router.post("/", createIssue);
router.put("/:id/status", requireRole("officer", "admin"), updateIssueStatus);

module.exports = router;