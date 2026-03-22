// backend/routes/qrRoutes.js
const router = require('express').Router()
const { generateQR, scanQR, getBookingDetails } = require('../controllers/qrController')
const { protect, isOfficer } = require('../middleware/authMiddleware')

router.get('/generate/:bookingId',  protect, isOfficer, generateQR)
router.post('/scan',                protect, isOfficer, scanQR)
router.get('/booking/:bookingId',   protect, isOfficer, getBookingDetails)

module.exports = router