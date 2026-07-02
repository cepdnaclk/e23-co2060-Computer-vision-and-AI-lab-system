const express = require("express");
const router = express.Router();

const {
    getAllPeople,
    createPerson,
    updatePerson,
    deletePerson
} = require("../controllers/peopleController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", getAllPeople);
router.post("/", verifyToken, requireRole("officer", "admin"), createPerson);
router.put("/:id", verifyToken, requireRole("officer", "admin"), updatePerson);
router.delete("/:id", verifyToken, requireRole("officer", "admin"), deletePerson);

module.exports = router;
