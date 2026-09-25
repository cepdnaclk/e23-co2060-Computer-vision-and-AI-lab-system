const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
// Restrict CORS to known frontend origins
const allowedOrigins = [
    process.env.PORTAL_URL ? process.env.PORTAL_URL.replace(/\/$/, "") : "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://e23-co2060-computer-vision-and-ai-l.vercel.app"
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. server-to-server, curl)
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express.json());

// Health Check for Deployment
app.get("/", (req, res) => res.send("CV & AI Lab API is running..."));

// Import routes
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const usersRoutes = require("./routes/usersRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const newsRoutes = require("./routes/newsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const issueRoutes = require("./routes/issueRoutes");

// Use routes
app.use("/api/items", inventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/issues", issueRoutes);

// Ensure required tables exist on every server start
const ensureTables = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS otp_verifications (
            email VARCHAR(200) PRIMARY KEY,
            otp VARCHAR(6) NOT NULL,
            user_data JSONB NOT NULL,
            expires_at TIMESTAMP NOT NULL
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS password_reset_otp (
            email VARCHAR(200) PRIMARY KEY,
            otp VARCHAR(6) NOT NULL,
            expires_at TIMESTAMP NOT NULL
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS equipment_issue_reports (
            id SERIAL PRIMARY KEY,
            inventory_id INTEGER NOT NULL REFERENCES inventory(id),
            reported_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            issue_type VARCHAR(30) NOT NULL,
            description TEXT NOT NULL,
            urgency VARCHAR(20) NOT NULL DEFAULT 'Normal',
            status VARCHAR(20) NOT NULL DEFAULT 'Open',
            admin_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("Database tables verified.");
};

// Test database connection before starting
const startServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connected successfully");

        await ensureTables();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};



if (require.main === module) startServer();

module.exports = { app, ensureTables };
