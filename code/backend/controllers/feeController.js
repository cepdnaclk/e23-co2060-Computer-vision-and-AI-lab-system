// backend/controllers/feeController.js
// Handles fee calculation, payment proof upload, and payment status tracking for external users

const { query, getClient } = require('../config/db')
const path = require('path')
const fs   = require('fs')

// GET /api/fees  — get fee-related bookings
const getFees = async (req, res) => {
  try {
    const isPriv = ['officer', 'admin'].includes(req.user.role)

    const sql = isPriv
      ? `SELECT eb.id, eb.total_fee, eb.payment_proof, eb.status, eb.start_time, eb.end_time,
                e.name AS equipment_name, u.first_name, u.last_name, u.email, u.role AS user_role
         FROM equipment_bookings eb
         JOIN equipment e ON e.id = eb.equipment_id
         JOIN users     u ON u.id = eb.user_id
         WHERE eb.total_fee > 0
         ORDER BY eb.created_at DESC`
      : `SELECT eb.id, eb.total_fee, eb.payment_proof, eb.status, eb.start_time, eb.end_time,
                e.name AS equipment_name
         FROM equipment_bookings eb
         JOIN equipment e ON e.id = eb.equipment_id
         WHERE eb.user_id = $1 AND eb.total_fee > 0
         ORDER BY eb.created_at DESC`

    const params = isPriv ? [] : [req.user.id]
    const { rows } = await query(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/fees/summary  — total fees owed and paid for current user
const getFeeSummary = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT
         COALESCE(SUM(total_fee) FILTER (WHERE status IN ('approved','active')),0) AS fees_due,
         COALESCE(SUM(total_fee) FILTER (WHERE status = 'returned'),0)             AS fees_paid,
         COALESCE(SUM(total_fee) FILTER (WHERE payment_proof IS NOT NULL AND status='pending'),0) AS pending_verification
       FROM equipment_bookings
       WHERE user_id=$1 AND total_fee > 0`,
      [req.user.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// PATCH /api/fees/:bookingId/proof  — user submits payment proof (base64 or file path)
const submitPaymentProof = async (req, res) => {
  try {
    const { payment_proof } = req.body   // base64 string or URL
    if (!payment_proof) return res.status(400).json({ message: 'payment_proof is required' })

    // Ensure it belongs to this user and fee > 0
    const check = await query(
      `SELECT id FROM equipment_bookings WHERE id=$1 AND user_id=$2 AND total_fee > 0`,
      [req.params.bookingId, req.user.id]
    )
    if (!check.rows.length) return res.status(404).json({ message: 'Booking not found' })

    await query(
      `UPDATE equipment_bookings SET payment_proof=$1, updated_at=NOW() WHERE id=$2`,
      [payment_proof, req.params.bookingId]
    )

    // Notify officers
    const officers = await query(
      `SELECT id FROM users WHERE role IN ('officer','admin') AND status='active'`
    )
    await Promise.all(officers.rows.map(o =>
      query(
        `INSERT INTO notifications(user_id, title, message, type, ref_id)
         VALUES($1,$2,$3,$4,$5)`,
        [o.id, 'Payment Proof Submitted',
         `User ${req.user.first_name} ${req.user.last_name} has submitted payment proof for booking ${req.params.bookingId}`,
         'payment', req.params.bookingId]
      )
    ))

    res.json({ message: 'Payment proof submitted. Awaiting verification.' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// PATCH /api/fees/:bookingId/verify  — officer verifies payment
const verifyPayment = async (req, res) => {
  try {
    const { verified } = req.body   // true / false

    const { rows } = await query(
      `SELECT * FROM equipment_bookings WHERE id=$1 AND total_fee > 0`,
      [req.params.bookingId]
    )
    if (!rows.length) return res.status(404).json({ message: 'Booking not found' })

    const newStatus = verified ? 'approved' : 'pending'
    const qrCode = verified
      ? `CVLAB-${req.params.bookingId.slice(0,8).toUpperCase()}`
      : null

    await query(
      `UPDATE equipment_bookings
       SET status=$1, approved_by=$2, ${qrCode ? 'qr_code=$3,' : ''} updated_at=NOW()
       WHERE id=$${qrCode ? '4' : '3'}`,
      qrCode
        ? [newStatus, req.user.id, qrCode, req.params.bookingId]
        : [newStatus, req.user.id, req.params.bookingId]
    )

    // Notify the user
    await query(
      `INSERT INTO notifications(user_id, title, message, type, ref_id)
       VALUES($1,$2,$3,$4,$5)`,
      [
        rows[0].user_id,
        verified ? 'Payment Verified' : 'Payment Not Verified',
        verified
          ? 'Your payment has been verified. Your booking is now approved.'
          : 'Your payment could not be verified. Please resubmit.',
        'payment',
        req.params.bookingId,
      ]
    )

    res.json({ message: verified ? 'Payment verified, booking approved' : 'Payment rejected' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getFees, getFeeSummary, submitPaymentProof, verifyPayment }