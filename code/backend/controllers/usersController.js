const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role FROM users ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role || "student"]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const existing = await pool.query("SELECT id FROM users WHERE id = $1", [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const duplicate = await pool.query(
            "SELECT id FROM users WHERE email = $1 AND id <> $2",
            [email, id]
        );
        if (duplicate.rows.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        let query;
        let values;

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE users SET name = $1, email = $2, role = $3, password = $4 WHERE id = $5 RETURNING id, name, email, role";
            values = [name, email, role, hashedPassword, id];
        } else {
            query = "UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role";
            values = [name, email, role, id];
        }

        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting user" });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};
