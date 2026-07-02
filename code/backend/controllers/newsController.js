const pool = require("../config/db");

const getAllNews = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM news ORDER BY published_date DESC, id DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching news" });
    }
};

const createNews = async (req, res) => {
    try {
        const { category, title, content, published_date } = req.body;
        const result = await pool.query(
            "INSERT INTO news (category, title, content, published_date) VALUES ($1, $2, $3, $4) RETURNING *",
            [category, title, content, published_date || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating news item" });
    }
};

const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, title, content, published_date } = req.body;
        const result = await pool.query(
            "UPDATE news SET category = $1, title = $2, content = $3, published_date = $4 WHERE id = $5 RETURNING *",
            [category, title, content, published_date || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "News item not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating news item" });
    }
};

const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM news WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "News item not found" });
        }

        res.json({ message: "News item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting news item" });
    }
};

module.exports = {
    getAllNews,
    createNews,
    updateNews,
    deleteNews
};
