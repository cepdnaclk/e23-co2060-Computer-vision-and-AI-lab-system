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

module.exports = {
    getAllItems,
    createItem,
};