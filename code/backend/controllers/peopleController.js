const pool = require("../config/db");

const getAllPeople = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM people ORDER BY sort_order ASC, id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching people" });
    }
};

const createPerson = async (req, res) => {
    try {
        const { name, title, dept, research, type, sort_order } = req.body;
        const result = await pool.query(
            "INSERT INTO people (name, title, dept, research, type, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, title, dept, research, type, sort_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating person" });
    }
};

const updatePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, dept, research, type, sort_order } = req.body;
        const result = await pool.query(
            "UPDATE people SET name = $1, title = $2, dept = $3, research = $4, type = $5, sort_order = $6 WHERE id = $7 RETURNING *",
            [name, title, dept, research, type, sort_order || 0, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Person not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating person" });
    }
};

const deletePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM people WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Person not found" });
        }

        res.json({ message: "Person deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting person" });
    }
};

module.exports = {
    getAllPeople,
    createPerson,
    updatePerson,
    deletePerson
};
