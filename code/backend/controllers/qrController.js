// backend/controllers/qrController.js
// Handles QR code generation (on booking approval) and scanning (officer pickup verification)

const { query } = require('../config/db')
const crypto    = require('crypto')

// ── Generate a deterministic QR payload for a booking ─────────────
// Called internally when a booking is approved
const generateQRPayload = (bookingId) => {
  const hash = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'cvlab-secret')
    .update(bookingId)
    .digest('hex')
    .slice(0, 12)
    .toUpperCase()
  return `CVLAB-${bookingId.slice(0, 8).toUpperCase()}-${hash}`
}

// POST /api/qr/generate/:bookingId  — staff/officer only
// Regenerates / fetches the QR code string for a booking
const generateQR = async (req, res) => {
  try {
    const { bookingId } = req.params

    const { rows } = await query(
      `SELECT eb.*, e.name AS equipment_name, u.first_name, u.last_name, u.email
       FROM equipment_bookings eb
       JOIN equipment e ON e.id = eb.equipment_id
       JOIN users     u ON u.id = eb.user_id
       WHERE eb.id = $1`,
      [bookingId]
    )
    if (!rows.length) return res.status(404).json({ message: 'Booking not found' })

    const booking = rows[0]
    if (!['approved', 'active'].includes(booking.status)) {
      return res.status(400).json({ message: 'QR only available for approved bookings' })
    }

    const payload = booking.qr_code || generateQRPayload(bookingId)

    // Persist if not yet stored
    if (!booking.qr_code) {
      await query(
        `UPDATE equipment_bookings SET qr_code=$1 WHERE id=$2`,
        [payload, bookingId]
      )
    }

    res.json({
      qr_payload: payload,
      booking: {
        id:             booking.id,
        equipment_name: booking.equipment_name,
        user_name:      `${booking.first_name} ${booking.last_name}`,
        user_email:     booking.email,
        start_time:     booking.start_time,
        end_time:       booking.end_time,
        status:         booking.status,
        quantity:       booking.quantity,
        purpose:        booking.purpose,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/qr/scan  — officer only
// Body: { qr_payload }
// Validates the QR, marks booking active (pickup) or returned
const scanQR = async (req, res) => {
  try {
    const { qr_payload } = req.body
    if (!qr_payload) return res.status(400).json({ message: 'QR payload required' })

    const { rows } = await query(
      `SELECT eb.*, e.name AS equipment_name, u.first_name, u.last_name, u.role AS user_role
       FROM equipment_bookings eb
       JOIN equipment e ON e.id = eb.equipment_id
       JOIN users     u ON u.id = eb.user_id
       WHERE eb.qr_code = $1`,
      [qr_payload]
    )

    if (!rows.length) return res.status(404).json({ message: 'Invalid or unrecognised QR code' })

    const booking = rows[0]
    let newStatus = null
    let message   = ''

    if (booking.status === 'approved') {
      // First scan → mark as picked up / active
      newStatus = 'active'
      message   = `Equipment collected by ${booking.first_name} ${booking.last_name}`
    } else if (booking.status === 'active') {
      // Second scan → mark as returned
      newStatus = 'returned'
      message   = `Equipment returned by ${booking.first_name} ${booking.last_name}`
    } else {
      return res.status(409).json({
        message: `Booking already in status: ${booking.status}`,
        booking,
      })
    }

    await query(
      `UPDATE equipment_bookings
       SET status=$1, scanned_by=$2, ${newStatus === 'returned' ? 'returned_at=NOW(),' : ''}
           updated_at=NOW()
       WHERE id=$3`,
      [newStatus, req.user.id, booking.id]
    )

    // Notify the user
    await query(
      `INSERT INTO notifications(user_id, title, message, type, ref_id)
       VALUES($1,$2,$3,$4,$5)`,
      [
        booking.user_id,
        newStatus === 'active' ? 'Equipment Collected' : 'Equipment Returned',
        newStatus === 'active'
          ? `You have collected: ${booking.equipment_name}`
          : `Return confirmed for: ${booking.equipment_name}`,
        'booking_status',
        booking.id,
      ]
    )

    res.json({
      success:    true,
      action:     newStatus,
      message,
      booking_id: booking.id,
      equipment:  booking.equipment_name,
      user:       `${booking.first_name} ${booking.last_name}`,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/qr/booking/:bookingId  — get booking details by ID (for QR detail view)
const getBookingDetails = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT eb.*, e.name AS equipment_name, e.category, e.location,
              u.first_name, u.last_name, u.email, u.student_id, u.role AS user_role
       FROM equipment_bookings eb
       JOIN equipment e ON e.id = eb.equipment_id
       JOIN users     u ON u.id = eb.user_id
       WHERE eb.id = $1`,
      [req.params.bookingId]
    )
    if (!rows.length) return res.status(404).json({ message: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { generateQR, scanQR, getBookingDetails, generateQRPayload }