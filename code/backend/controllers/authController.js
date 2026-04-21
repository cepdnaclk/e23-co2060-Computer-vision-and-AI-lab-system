const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../services/emailService");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existing = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Hash the password — never store plain text
        // 10 = "salt rounds", higher = more secure but slower
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role || "student"]
        );

        // Send registration confirmation email (non-blocking)
        sendRegistrationEmail(email, name, role || "student").catch(err => 
            console.error("Email sending failed (non-critical):", err.message)
        );

        res.status(201).json({ message: "User registered", user: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token — contains user info, signed with secret key
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }  // token expires in 1 day
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};

module.exports = { register, login };