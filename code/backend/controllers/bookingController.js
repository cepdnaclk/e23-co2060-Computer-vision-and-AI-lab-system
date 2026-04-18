const pool = require("../config/db");

// 1. Submit a new booking (For Students)
const createBooking = async (req, res) => {
    try {
        const { requestType, resource, date, time, purpose } = req.body;
        const userId = req.user.id; // Comes from your verifyToken middleware

        const result = await pool.query(
            `INSERT INTO reservations 
            (user_id, request_type, resource, booking_date, time_slot, purpose, status) 
            VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`,
            [userId, requestType, resource, date, time, purpose]
        );

        res.status(201).json({ message: "Booking submitted", booking: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating booking" });
    }
};

// 2. Get bookings (Admins see all, Students see only their own)
const getBookings = async (req, res) => {
    try {
        let result;
        if (req.user.role === "officer" || req.user.role === "admin" || req.user.role === "staff") {
            // Admins get everything, plus the user's name
            result = await pool.query(`
                SELECT r.*, u.name as user_name 
                FROM reservations r 
                JOIN users u ON r.user_id = u.id 
                ORDER BY r.created_at DESC
            `);
        } else {
            // Students only see their personal history
            result = await pool.query(
                "SELECT * FROM reservations WHERE user_id = $1 ORDER BY created_at DESC", 
                [req.user.id]
            );
        }
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

// 3. Update booking status (For Admins)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "Approved" or "Rejected"

        const result = await pool.query(
            "UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking updated", booking: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating booking" });
    }
};

module.exports = { createBooking, getBookings, updateBookingStatus };