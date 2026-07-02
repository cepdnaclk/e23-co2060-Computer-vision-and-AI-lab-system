const express = require("express");
const router = express.Router();

const {
    getAllNews,
    createNews,
    updateNews,
    deleteNews
} = require("../controllers/newsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", getAllNews);
router.post("/", verifyToken, requireRole("officer", "admin"), createNews);
router.put("/:id", verifyToken, requireRole("officer", "admin"), updateNews);
router.delete("/:id", verifyToken, requireRole("officer", "admin"), deleteNews);

module.exports = router;
