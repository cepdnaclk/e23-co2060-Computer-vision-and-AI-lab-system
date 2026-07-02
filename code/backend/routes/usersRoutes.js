const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/usersController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken, requireRole("officer", "admin"));

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
