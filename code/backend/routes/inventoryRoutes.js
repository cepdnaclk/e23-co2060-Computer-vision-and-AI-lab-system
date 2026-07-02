const express = require("express")
const router = express.Router();

const { getAllItems, createItem, deleteItem, updateItem } = require("../controllers/inventoryController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllItems);                              // any logged in user
router.post("/", verifyToken, requireRole("officer", "admin"), createItem);     // officer/admin
router.put("/:id", verifyToken, requireRole("officer", "admin"), updateItem);    // officer/admin
router.delete("/:id", verifyToken, requireRole("officer", "admin"), deleteItem); // officer/admin

module.exports=router;