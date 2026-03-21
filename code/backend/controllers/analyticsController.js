// backend/controllers/analyticsController.js
// Provides aggregated statistics for the Admin analytics dashboard

const { query } = require('../config/db')

// GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const [
      usersRes, equipRes, bookingsRes, gpuRes,
      pendingUsersRes, pendingBookingsRes, revenueRes,
    ] = await Promise.all([
      query(`SELECT COUNT(*) FROM users WHERE status='active'`),
      query(`SELECT COUNT(*) FROM equipment WHERE status='available'`),
      query(`SELECT COUNT(*) FROM equipment_bookings WHERE DATE(created_at) = CURRENT_DATE`),
      query(`SELECT COUNT(*) FROM gpu_requests WHERE status IN ('pending','running')`),
      query(`SELECT COUNT(*) FROM users WHERE status='pending'`),
      query(`SELECT COUNT(*) FROM equipment_bookings WHERE status='pending'`),
      query(`SELECT COALESCE(SUM(total_fee),0) AS total FROM equipment_bookings WHERE status IN ('returned','active') AND DATE_TRUNC('month', created_at)=DATE_TRUNC('month',NOW())`),
    ])

    res.json({
      active_users:      parseInt(usersRes.rows[0].count),
      available_equipment: parseInt(equipRes.rows[0].count),
      bookings_today:    parseInt(bookingsRes.rows[0].count),
      active_gpu_jobs:   parseInt(gpuRes.rows[0].count),
      pending_users:     parseInt(pendingUsersRes.rows[0].count),
      pending_bookings:  parseInt(pendingBookingsRes.rows[0].count),
      monthly_revenue:   parseFloat(revenueRes.rows[0].total),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/analytics/bookings-by-month  — last 6 months
const getBookingsByMonth = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YY') AS month,
        COUNT(*) FILTER (WHERE status IN ('approved','active','returned')) AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected')                        AS rejected,
        COUNT(*) FILTER (WHERE status = 'pending')                         AS pending
      FROM equipment_bookings
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/analytics/equipment-usage  — most booked equipment
const getEquipmentUsage = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT e.name, e.category,
             COUNT(eb.id)                         AS total_bookings,
             COUNT(eb.id) FILTER (WHERE eb.status='returned') AS completed,
             COALESCE(SUM(eb.total_fee),0)         AS revenue
      FROM equipment e
      LEFT JOIN equipment_bookings eb ON eb.equipment_id = e.id
      GROUP BY e.id, e.name, e.category
      ORDER BY total_bookings DESC
      LIMIT 10
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/analytics/bookings-by-category  — pie chart data
const getBookingsByCategory = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT e.category, COUNT(eb.id) AS count
      FROM equipment_bookings eb
      JOIN equipment e ON e.id = eb.equipment_id
      WHERE eb.created_at >= NOW() - INTERVAL '3 months'
      GROUP BY e.category
      ORDER BY count DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/analytics/user-activity  — new registrations per month
const getUserActivity = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YY') AS month,
        COUNT(*) FILTER (WHERE role LIKE 'student%')  AS students,
        COUNT(*) FILTER (WHERE role IN ('staff','professor')) AS staff
      FROM users
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/analytics/recent-activity  — activity feed for admin
const getRecentActivity = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT 'booking' AS type, eb.id, eb.status, eb.created_at,
             e.name AS subject, u.first_name || ' ' || u.last_name AS actor
      FROM equipment_bookings eb
      JOIN equipment e ON e.id=eb.equipment_id
      JOIN users u ON u.id=eb.user_id
      UNION ALL
      SELECT 'gpu' AS type, gr.id, gr.status::text, gr.created_at,
             gr.job_name AS subject, u.first_name || ' ' || u.last_name AS actor
      FROM gpu_requests gr
      JOIN users u ON u.id=gr.user_id
      UNION ALL
      SELECT 'user' AS type, u.id, u.status::text, u.created_at,
             u.email AS subject, u.first_name || ' ' || u.last_name AS actor
      FROM users u
      WHERE u.created_at >= NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 20
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/analytics/gpu-usage  — GPU hours per month
const getGpuUsage = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YY') AS month,
        SUM(gpu_count * duration_hours) AS total_gpu_hours,
        COUNT(*) AS total_jobs
      FROM gpu_requests
      WHERE status IN ('completed','running')
        AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getOverview,
  getBookingsByMonth,
  getEquipmentUsage,
  getBookingsByCategory,
  getUserActivity,
  getRecentActivity,
  getGpuUsage,
}