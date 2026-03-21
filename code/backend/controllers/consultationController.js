// backend/controllers/consultationController.js
const { query } = require('../config/db')

// GET /api/consultations
const getConsultations = async (req, res) => {
  try {
    const isPriv = ['staff', 'professor', 'officer', 'admin'].includes(req.user.role)

    let sql, params
    if (isPriv) {
      // Staff sees requests assigned to them OR all if admin/officer
      const isAdmin = ['admin', 'officer'].includes(req.user.role)
      sql = isAdmin
        ? `SELECT c.*,
                  s.first_name AS student_fn, s.last_name AS student_ln, s.email AS student_email,
                  f.first_name AS staff_fn,   f.last_name AS staff_ln,   f.email AS staff_email
           FROM consultations c
           JOIN users s ON s.id = c.student_id
           JOIN users f ON f.id = c.staff_id
           ORDER BY c.proposed_at DESC`
        : `SELECT c.*,
                  s.first_name AS student_fn, s.last_name AS student_ln, s.email AS student_email,
                  f.first_name AS staff_fn,   f.last_name AS staff_ln
           FROM consultations c
           JOIN users s ON s.id = c.student_id
           JOIN users f ON f.id = c.staff_id
           WHERE c.staff_id = $1
           ORDER BY c.proposed_at DESC`
      params = isAdmin ? [] : [req.user.id]
    } else {
      // Students see their own requests
      sql = `SELECT c.*,
                    f.first_name AS staff_fn, f.last_name AS staff_ln,
                    f.email AS staff_email, f.department
             FROM consultations c
             JOIN users f ON f.id = c.staff_id
             WHERE c.student_id = $1
             ORDER BY c.proposed_at DESC`
      params = [req.user.id]
    }

    const { rows } = await query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/consultations  — students only
const createConsultation = async (req, res) => {
  try {
    const { staff_id, topic, description, proposed_at, duration_m } = req.body

    // Check proposed time is in the future
    if (new Date(proposed_at) <= new Date()) {
      return res.status(400).json({ message: 'Proposed time must be in the future' })
    }

    // Check the staff member exists and is active
    const staffCheck = await query(
      `SELECT id FROM users WHERE id=$1 AND role IN ('staff','professor') AND status='active'`,
      [staff_id]
    )
    if (!staffCheck.rows.length) {
      return res.status(404).json({ message: 'Staff member not found or inactive' })
    }

    const { rows } = await query(
      `INSERT INTO consultations(student_id, staff_id, topic, description, proposed_at, duration_m)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, staff_id, topic, description, proposed_at, duration_m || 30]
    )

    // Notify the staff member
    await query(
      `INSERT INTO notifications(user_id, title, message, type, ref_id)
       VALUES($1,$2,$3,$4,$5)`,
      [
        staff_id,
        'New Consultation Request',
        `${req.user.first_name} ${req.user.last_name} requested a consultation: "${topic}"`,
        'consultation',
        rows[0].id,
      ]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// PATCH /api/consultations/:id/status  — staff only
const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body
    const allowed = ['approved', 'rejected', 'cancelled', 'returned']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    // Staff can only update consultations assigned to them (unless admin)
    const isAdmin = ['admin', 'officer'].includes(req.user.role)
    const checkSql = isAdmin
      ? `SELECT * FROM consultations WHERE id=$1`
      : `SELECT * FROM consultations WHERE id=$1 AND staff_id=$2`
    const checkParams = isAdmin ? [req.params.id] : [req.params.id, req.user.id]

    const check = await query(checkSql, checkParams)
    if (!check.rows.length) {
      return res.status(403).json({ message: 'Not authorised or consultation not found' })
    }

    const { rows } = await query(
      `UPDATE consultations SET status=$1, notes=COALESCE($2,notes), updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [status, notes, req.params.id]
    )

    // Notify the student
    await query(
      `INSERT INTO notifications(user_id, title, message, type, ref_id)
       VALUES($1,$2,$3,$4,$5)`,
      [
        check.rows[0].student_id,
        `Consultation ${status}`,
        `Your consultation request "${check.rows[0].topic}" has been ${status}.${notes ? ' Note: ' + notes : ''}`,
        'consultation',
        req.params.id,
      ]
    )

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/consultations/:id  — student cancels own pending request
const cancelConsultation = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM consultations WHERE id=$1 AND student_id=$2 AND status='pending'`,
      [req.params.id, req.user.id]
    )
    if (!rows.length) {
      return res.status(403).json({ message: 'Cannot cancel this consultation' })
    }
    await query(
      `UPDATE consultations SET status='cancelled', updated_at=NOW() WHERE id=$1`,
      [req.params.id]
    )
    res.json({ message: 'Consultation cancelled' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/consultations/staff/:staffId/availability
// Returns booked slots for a staff member on a given date
const getStaffAvailability = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ message: 'date query param required' })

    const { rows } = await query(
      `SELECT proposed_at, duration_m, status FROM consultations
       WHERE staff_id=$1 AND DATE(proposed_at)=$2 AND status IN ('pending','approved')
       ORDER BY proposed_at`,
      [req.params.staffId, date]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getConsultations, createConsultation, updateStatus, cancelConsultation, getStaffAvailability }