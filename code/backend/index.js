const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
// Allowed all origins for local development flexibility
app.use(cors());
app.use(express.json());

// Health Check for Deployment
app.get("/", (req, res) => res.send("CV & AI Lab API is running..."));

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

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};



startServer();