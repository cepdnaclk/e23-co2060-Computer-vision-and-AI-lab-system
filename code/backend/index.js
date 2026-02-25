const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());


// Test database connection
const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Database connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

startServer();