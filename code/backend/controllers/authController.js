const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail, sendOtpEmail, sendPasswordResetOtpEmail } = require("../services/emailService");
const { OAuth2Client } = require("google-auth-library");

// INITIATE REGISTRATION (Step 1) — generates and sends OTP
const initiateRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Only internal university email addresses may self-register
        if (!email.toLowerCase().endsWith("@eng.pdn.ac.lk")) {
            return res.status(403).json({
                message: "Self-registration is only available for University of Peradeniya students (@eng.pdn.ac.lk). External users must contact the lab admin to request access."
            });
        }

        // Check if user already exists in main users table
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash the password now so we don't store plaintext password anywhere
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Expires in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60000); 

        // Upsert into otp_verifications table
        await pool.query(
            `INSERT INTO otp_verifications (email, otp, user_data, expires_at) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO UPDATE SET otp = EXCLUDED.otp, user_data = EXCLUDED.user_data, expires_at = EXCLUDED.expires_at`,
            [email, otp, JSON.stringify({ name, password: hashedPassword }), expiresAt]
        );

        // Send OTP email
        const emailSent = await sendOtpEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send verification email. Please try again." });
        }

        res.status(200).json({ message: "Verification code sent to email" });
    } catch (error) {
        console.error("Initiate Registration Error:", error);
        res.status(500).json({ message: "Failed to initiate registration" });
    }
};

// VERIFY REGISTRATION (Step 2) — validates OTP and creates user
const verifyRegistration = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // Fetch OTP record
        const record = await pool.query("SELECT * FROM otp_verifications WHERE email = $1", [email]);
        if (record.rows.length === 0) {
            return res.status(400).json({ message: "Verification session not found or expired. Please register again." });
        }

        const otpData = record.rows[0];

        // Check expiration
        if (new Date() > new Date(otpData.expires_at)) {
            await pool.query("DELETE FROM otp_verifications WHERE email = $1", [email]);
            return res.status(400).json({ message: "Verification code has expired. Please register again." });
        }

        // Check OTP match
        if (otpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // OTP is valid, create the user!
        const assignedRole = "student";
        const userData = otpData.user_data;

        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [userData.name, email, userData.password, assignedRole]
        );

        // Delete the OTP record so it can't be reused
        await pool.query("DELETE FROM otp_verifications WHERE email = $1", [email]);

        // Send welcome email (non-blocking)
        sendRegistrationEmail(email, userData.name, assignedRole).catch(err =>
            console.error("Welcome email sending failed (non-critical):", err.message)
        );

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });

    } catch (error) {
        console.error("Verify Registration Error:", error);
        res.status(500).json({ message: "Registration verification failed" });
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

// GOOGLE LOGIN / REGISTER
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: "No credential provided" });

        const client = new OAuth2Client(process.env.Client_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.Client_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        // Ensure domain restriction
        if (!email.toLowerCase().endsWith("@eng.pdn.ac.lk")) {
            return res.status(403).json({
                message: "Google login is only available for University of Peradeniya students (@eng.pdn.ac.lk). Please use an allowed account."
            });
        }

        // Check if user exists
        let userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        let user;

        if (userResult.rows.length === 0) {
            // Register new user instantly
            const assignedRole = "student";
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            
            const insertResult = await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name, email, randomPassword, assignedRole]
            );
            user = insertResult.rows[0];

            // Send welcome email (non-blocking)
            sendRegistrationEmail(email, name, assignedRole).catch(err =>
                console.error("Welcome email sending failed (non-critical):", err.message)
            );
        } else {
            user = userResult.rows[0];
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: "Google Login failed" });
    }
};

// FORGOT PASSWORD — STEP 1: generate and send OTP to the user's email
const forgotPasswordInitiate = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if a user with this email actually exists
        const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rows.length === 0) {
            // Same generic message whether or not the account exists, so we
            // don't leak which emails are registered.
            return res.status(200).json({ message: "If an account exists for this email, a verification code has been sent." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Expires in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60000);

        // Upsert into password_reset_otp table
        await pool.query(
            `INSERT INTO password_reset_otp (email, otp, expires_at)
             VALUES ($1, $2, $3)
             ON CONFLICT (email) DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
            [email, otp, expiresAt]
        );

        // Send OTP email
        const emailSent = await sendPasswordResetOtpEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send verification email. Please try again." });
        }

        res.status(200).json({ message: "If an account exists for this email, a verification code has been sent." });
    } catch (error) {
        console.error("Forgot Password Initiate Error:", error);
        res.status(500).json({ message: "Failed to initiate password reset" });
    }
};

// FORGOT PASSWORD — STEP 2: verify OTP and set the new password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, code, and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Fetch OTP record
        const record = await pool.query("SELECT * FROM password_reset_otp WHERE email = $1", [email]);
        if (record.rows.length === 0) {
            return res.status(400).json({ message: "Verification session not found or expired. Please request a new code." });
        }

        const otpData = record.rows[0];

        // Check expiration
        if (new Date() > new Date(otpData.expires_at)) {
            await pool.query("DELETE FROM password_reset_otp WHERE email = $1", [email]);
            return res.status(400).json({ message: "Verification code has expired. Please request a new code." });
        }

        // Check OTP match
        if (otpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // OTP is valid, hash and update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

        // Delete the OTP record so it can't be reused
        await pool.query("DELETE FROM password_reset_otp WHERE email = $1", [email]);

        res.status(200).json({ message: "Password has been reset successfully. You can now sign in with your new password." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
};

module.exports = { initiateRegistration, verifyRegistration, login, googleLogin, forgotPasswordInitiate, resetPassword };