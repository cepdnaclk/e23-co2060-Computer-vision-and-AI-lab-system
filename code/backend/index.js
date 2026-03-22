// backend/index.js  — UPDATED with all new routes
require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const { pool } = require('./config/db')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '20mb' }))   // larger limit for base64 payment proofs
app.use(express.urlencoded({ extended: true }))

// ── Existing routes ───────────────────────────────────────────
app.use('/api/auth',          require('./routes/authRoutes'))
app.use('/api/equipment',     require('./routes/equipmentRoutes'))
app.use('/api/bookings',      require('./routes/bookingRoutes'))
app.use('/api/gpu',           require('./routes/gpuRoutes'))
app.use('/api/spaces',        require('./routes/spaceRoutes'))
app.use('/api/users',         require('./routes/userRoutes'))
app.use('/api/news',          require('./routes/newsRoutes'))
app.use('/api/projects',      require('./routes/projectRoutes'))
app.use('/api/notifications', require('./routes/notificationRoutes'))

// ── NEW routes ────────────────────────────────────────────────
app.use('/api/qr',            require('./routes/qrRoutes'))
app.use('/api/analytics',     require('./routes/analyticsRoutes'))
app.use('/api/consultations', require('./routes/consultationRoutes'))
app.use('/api/publications',  require('./routes/publicationRoutes'))
app.use('/api/fees',          require('./routes/feeRoutes'))

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected', timestamp: new Date(), version: '2.0' })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

app.use((req, res) => res.status(404).json({ message: `${req.method} ${req.url} not found` }))
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 CV Lab API v2 → http://localhost:${PORT}`))