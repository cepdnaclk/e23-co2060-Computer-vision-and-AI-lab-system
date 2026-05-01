const express = require("express")
const router = express.Router();

const { getAllItems, createItem, deleteItem } = require("../controllers/inventoryController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllItems);                              // any logged in user
router.post("/", verifyToken, requireRole("officer"), createItem);     // only officer
router.delete("/:id", verifyToken, requireRole("officer"), deleteItem); // only officer

module.exports=router;