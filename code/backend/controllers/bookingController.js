const pool = require('../config/db');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Generate booking reference
const generateBookingRef = async () => {
  const year = new Date().getFullYear();
  const result = await pool.query("SELECT COUNT(*) FROM bookings WHERE EXTRACT(YEAR FROM created_at) = $1", [year]);
  const count = parseInt(result.rows[0].count) + 1;
  return `BK-${year}-${String(count).padStart(5, '0')}`;
};

// -----------------------------------------------
// POST /api/bookings - Student creates a booking
// -----------------------------------------------
const createBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { equipment_id, quantity = 1, start_date, end_date, purpose, notes } = req.body;
    const user_id = req.user.id;

    if (!equipment_id || !start_date || !end_date || !purpose) {
      return res.status(400).json({ error: 'equipment_id, start_date, end_date, and purpose are required' });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ error: 'Start date must be before or equal to end date' });
    }
    if (new Date(start_date) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }

    await client.query('BEGIN');

    // Lock equipment row
    const eqResult = await client.query(
      'SELECT * FROM equipment WHERE id = $1 AND is_active = TRUE FOR UPDATE',
      [equipment_id]
    );
    if (eqResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Equipment not found or inactive' });
    }
    const equipment = eqResult.rows[0];

    // Check overlap
    const overlapResult = await client.query(
      `SELECT COALESCE(SUM(quantity), 0) AS booked_qty FROM bookings
       WHERE equipment_id = $1 AND status IN ('pending','approved','picked_up')
         AND start_date <= $3 AND end_date >= $2`,
      [equipment_id, start_date, end_date]
    );
    const bookedQty = parseInt(overlapResult.rows[0].booked_qty);
    if (bookedQty + parseInt(quantity) > equipment.total_quantity) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: `Only ${equipment.total_quantity - bookedQty} unit(s) available for the selected dates`,
      });
    }

    // Calculate fee for external users
    const userResult = await client.query('SELECT role FROM users WHERE id = $1', [user_id]);
    const userRole = userResult.rows[0].role;
    const days = Math.max(1, Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1);
    const total_fee = (userRole === 'external' && equipment.requires_payment)
      ? equipment.daily_rate * days * quantity
      : 0;
    const payment_status = total_fee > 0 ? 'pending' : 'not_required';

    const booking_ref = await generateBookingRef();

    const bookingResult = await client.query(
      `INSERT INTO bookings (booking_ref, user_id, equipment_id, quantity, start_date, end_date, purpose, notes, total_fee, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [booking_ref, user_id, equipment_id, quantity, start_date, end_date, purpose, notes, total_fee, payment_status]
    );
    const booking = bookingResult.rows[0];

    // Audit log
    await client.query(
      `INSERT INTO booking_history (booking_id, changed_by, new_status, note) VALUES ($1,$2,$3,$4)`,
      [booking.id, user_id, 'pending', 'Booking created by student']
    );

    // Notify professors
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type, booking_id)
       SELECT id, 'New Booking Request', 'A new equipment booking request requires your approval: ' || $1, 'info', $2
       FROM users WHERE role IN ('professor','admin')`,
      [booking_ref, booking.id]
    );

    await client.query('COMMIT');
    res.status(201).json({ booking, message: 'Booking submitted successfully! Awaiting approval.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    client.release();
  }
};

// -----------------------------------------------
// GET /api/bookings/my - Student's own bookings
// -----------------------------------------------
const getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status } = req.query;

    let query = `
      SELECT b.*, e.name AS equipment_name, e.model AS equipment_model, e.image_url,
             ec.name AS category_name, ec.icon AS category_icon,
             approver.name AS approved_by_name
      FROM bookings b
      JOIN equipment e ON b.equipment_id = e.id
      JOIN equipment_categories ec ON e.category_id = ec.id
      LEFT JOIN users approver ON b.approved_by = approver.id
      WHERE b.user_id = $1
    `;
    const params = [user_id];

    if (status) {
      params.push(status);
      query += ` AND b.status = $${params.length}`;
    }
    query += ' ORDER BY b.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// -----------------------------------------------
// GET /api/bookings/:id - Single booking detail
// -----------------------------------------------
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const userRole = req.user.role;

    const result = await pool.query(
      `SELECT b.*, e.name AS equipment_name, e.model AS equipment_model, e.image_url, e.location,
              ec.name AS category_name, ec.icon AS category_icon,
              u.name AS student_name, u.email AS student_email, u.student_id,
              approver.name AS approved_by_name
       FROM bookings b
       JOIN equipment e ON b.equipment_id = e.id
       JOIN equipment_categories ec ON e.category_id = ec.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN users approver ON b.approved_by = approver.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });

    const booking = result.rows[0];
    // Students can only see their own bookings
    if (userRole === 'student' && booking.user_id !== user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Fetch history
    const historyResult = await pool.query(
      `SELECT bh.*, u.name AS changed_by_name FROM booking_history bh
       LEFT JOIN users u ON bh.changed_by = u.id
       WHERE bh.booking_id = $1 ORDER BY bh.changed_at ASC`,
      [id]
    );

    res.json({ booking, history: historyResult.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// -----------------------------------------------
// PUT /api/bookings/:id/cancel - Student cancels
// -----------------------------------------------
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });

    const booking = result.rows[0];
    if (!['pending', 'approved'].includes(booking.status)) {
      return res.status(400).json({ error: `Cannot cancel a booking with status: ${booking.status}` });
    }

    await pool.query(
      "UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = $1",
      [id]
    );
    await pool.query(
      "INSERT INTO booking_history (booking_id, changed_by, old_status, new_status, note) VALUES ($1,$2,$3,'cancelled','Cancelled by student')",
      [id, user_id, booking.status]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// -----------------------------------------------
// GET /api/bookings/all - Professor/Officer view
// -----------------------------------------------
const getAllBookings = async (req, res) => {
  try {
    const { status, equipment_id, from, to, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, e.name AS equipment_name, e.image_url,
             ec.name AS category_name,
             u.name AS student_name, u.email AS student_email, u.student_id, u.role AS user_role
      FROM bookings b
      JOIN equipment e ON b.equipment_id = e.id
      JOIN equipment_categories ec ON e.category_id = ec.id
      JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) { params.push(status); query += ` AND b.status = $${params.length}`; }
    if (equipment_id) { params.push(equipment_id); query += ` AND b.equipment_id = $${params.length}`; }
    if (from) { params.push(from); query += ` AND b.start_date >= $${params.length}`; }
    if (to) { params.push(to); query += ` AND b.end_date <= $${params.length}`; }

    query += ` ORDER BY b.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM bookings');
    res.json({ bookings: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// -----------------------------------------------
// PUT /api/bookings/:id/approve - Professor approves
// -----------------------------------------------
const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const approver_id = req.user.id;

    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = result.rows[0];
    if (booking.status !== 'pending') return res.status(400).json({ error: 'Only pending bookings can be approved' });

    // Generate QR code token
    const qrToken = uuidv4();
    const qrData = JSON.stringify({ booking_ref: booking.booking_ref, token: qrToken, equipment_id: booking.equipment_id });
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    await pool.query(
      `UPDATE bookings SET status = 'approved', approved_by = $1, approved_at = NOW(), qr_code = $2, updated_at = NOW() WHERE id = $3`,
      [approver_id, qrCodeDataUrl, id]
    );
    await pool.query(
      "INSERT INTO booking_history (booking_id, changed_by, old_status, new_status, note) VALUES ($1,$2,'pending','approved','Approved by professor')",
      [id, approver_id]
    );
    // Notify student
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, booking_id)
       VALUES ($1, 'Booking Approved! ✅', 'Your booking ' || $2 || ' has been approved. Your QR code is ready.', 'success', $3)`,
      [booking.user_id, booking.booking_ref, id]
    );

    res.json({ message: 'Booking approved and QR code generated', qr_code: qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve booking' });
  }
};

// -----------------------------------------------
// PUT /api/bookings/:id/reject - Professor rejects
// -----------------------------------------------
const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const approver_id = req.user.id;

    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = result.rows[0];
    if (booking.status !== 'pending') return res.status(400).json({ error: 'Only pending bookings can be rejected' });

    await pool.query(
      `UPDATE bookings SET status = 'rejected', approved_by = $1, rejection_reason = $2, updated_at = NOW() WHERE id = $3`,
      [approver_id, reason || 'No reason provided', id]
    );
    await pool.query(
      "INSERT INTO booking_history (booking_id, changed_by, old_status, new_status, note) VALUES ($1,$2,'pending','rejected',$3)",
      [id, approver_id, reason]
    );
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, booking_id)
       VALUES ($1, 'Booking Rejected ❌', 'Your booking ' || $2 || ' was rejected. Reason: ' || $3, 'error', $4)`,
      [booking.user_id, booking.booking_ref, reason || 'No reason provided', id]
    );

    res.json({ message: 'Booking rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject booking' });
  }
};

// -----------------------------------------------
// GET /api/bookings/notifications - User's notifications
// -----------------------------------------------
const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json({ notifications: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// Get bookings (alias for getMyBookings)
const getBookings = getMyBookings;

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0], message: 'Booking status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

module.exports = {
  createBooking, getMyBookings, getBookingById, cancelBooking,
  getAllBookings, approveBooking, rejectBooking,
  getNotifications, markNotificationRead, getBookings, updateBookingStatus
};