const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Import routes
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Use routes
app.use("/api/items", inventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Test database connection before starting
const startServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};



startServer();