const jwt = require("jsonwebtoken");

// Verify token — runs before the actual route handler
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // Token comes as: "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // attach user info to the request
        next();              // pass control to the actual route handler
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

// Role-based guard — use after verifyToken
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };