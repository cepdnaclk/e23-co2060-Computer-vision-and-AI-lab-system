const express = require("express")
const router = express.Router();

const { getAllItems, createItem, deleteItem} = require("../controllers/inventoryController");
router.get("/", getAllItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);

module.exports=router;