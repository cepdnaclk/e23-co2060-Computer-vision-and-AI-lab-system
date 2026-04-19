const pool = require('../config/db');

// PUT /api/bookings/:id/pickup  — Officer marks equipment as picked up
const markPickedUp = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const officer_id = req.user.id;

    const result = await client.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = result.rows[0];

    if (booking.status !== 'approved') {
      return res.status(400).json({ error: 'Only approved bookings can be marked as picked up' });
    }

    await client.query('BEGIN');

    await client.query(
      `UPDATE bookings SET status = 'picked_up', updated_at = NOW() WHERE id = $1`,
      [id]
    );

    // Reduce available quantity
    await client.query(
      `UPDATE equipment SET available_quantity = available_quantity - $1, updated_at = NOW()
       WHERE id = $2`,
      [booking.quantity, booking.equipment_id]
    );

    await client.query(
      `INSERT INTO booking_history (booking_id, changed_by, old_status, new_status, note)
       VALUES ($1, $2, 'approved', 'picked_up', 'Equipment collected by student — confirmed by officer')`,
      [id, officer_id]
    );

    await client.query(
      `INSERT INTO notifications (user_id, title, message, type, booking_id)
       VALUES ($1, 'Equipment Picked Up', 'Your equipment for booking ' || $2 || ' has been marked as collected.', 'info', $3)`,
      [booking.user_id, booking.booking_ref, id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Booking marked as picked up' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to mark as picked up' });
  } finally {
    client.release();
  }
};

// PUT /api/bookings/:id/return  — Officer confirms equipment returned
const markReturned = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const officer_id = req.user.id;
    const { condition_note } = req.body;

    const result = await client.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = result.rows[0];

    if (booking.status !== 'picked_up') {
      return res.status(400).json({ error: 'Only picked_up bookings can be returned' });
    }

    await client.query('BEGIN');

    await client.query(
      `UPDATE bookings SET status = 'returned', updated_at = NOW() WHERE id = $1`,
      [id]
    );

    // Restore available quantity
    await client.query(
      `UPDATE equipment SET available_quantity = available_quantity + $1, updated_at = NOW()
       WHERE id = $2`,
      [booking.quantity, booking.equipment_id]
    );

    await client.query(
      `INSERT INTO booking_history (booking_id, changed_by, old_status, new_status, note)
       VALUES ($1, $2, 'picked_up', 'returned', $3)`,
      [id, officer_id, condition_note || 'Equipment returned to lab']
    );

    await client.query(
      `INSERT INTO notifications (user_id, title, message, type, booking_id)
       VALUES ($1, 'Equipment Returned ✅', 'Your booking ' || $2 || ' is now closed. Thank you!', 'success', $3)`,
      [booking.user_id, booking.booking_ref, id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Booking marked as returned' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to mark as returned' });
  } finally {
    client.release();
  }
};

// GET /api/bookings/lookup/:ref  — Find booking by reference (for QR scan)
const lookupByRef = async (req, res) => {
  try {
    const { ref } = req.params;
    const result = await pool.query(
      `SELECT b.*, e.name AS equipment_name, e.model AS equipment_model,
              u.name AS student_name, u.student_id
       FROM bookings b
       JOIN equipment e ON b.equipment_id = e.id
       JOIN users u ON b.user_id = u.id
       WHERE b.booking_ref = $1`,
      [ref.toUpperCase()]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Lookup failed' });
  }
};

// GET /api/dashboard/stats  — Admin/Officer overview stats
const getDashboardStats = async (req, res) => {
  try {
    const [bStats, eStats, uStats] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'pending')   AS pending,
          COUNT(*) FILTER (WHERE status = 'approved')  AS approved,
          COUNT(*) FILTER (WHERE status = 'picked_up') AS picked_up,
          COUNT(*) FILTER (WHERE status = 'returned')  AS returned,
          COUNT(*) FILTER (WHERE status = 'rejected')  AS rejected,
          COUNT(*)                                      AS total
        FROM bookings
      `),
      pool.query(`
        SELECT COUNT(*) AS total_items,
               SUM(available_quantity) AS total_available
        FROM equipment WHERE is_active = TRUE
      `),
      pool.query(`SELECT COUNT(*) AS total FROM users WHERE role = 'student'`),
    ]);

    res.json({
      bookings: bStats.rows[0],
      equipment: eStats.rows[0],
      students: uStats.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

module.exports = { markPickedUp, markReturned, lookupByRef, getDashboardStats };