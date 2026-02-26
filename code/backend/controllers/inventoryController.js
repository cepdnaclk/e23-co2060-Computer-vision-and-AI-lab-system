const pool = require("../config/db"); //connecting to the database

//get all items
const getAllItems = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM inventory");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching items" });
    }
};

//Post new items
const createItem=async(req,res)=>{
    try {
        const { name, category, description } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required" });
        }
        const result = await pool.query(
            "INSERT INTO inventory (name, category, description) VALUES ($1, $2, $3) RETURNING *",
            [name, category, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating item" });
    }
};

const deleteItem=async(req,res)=>{
    try {
        const {id}=req.params;
        const result = await pool.query("DELETE FROM inventory WHERE id = $1 RETURNING *",[id]);
        if(result.rows.length===0){
            return res.status(404).json({ message: "Item not found"});
        }
        res.status(200).json({
            message: "Item deleted succesfully",
            deletItem: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting item" });
    }
}
module.exports = {
    getAllItems,
    createItem,
    deleteItem
};