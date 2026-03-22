// backend/routes/feeRoutes.js
const router = require('express').Router()
const { getFees, getFeeSummary, submitPaymentProof, verifyPayment } = require('../controllers/feeController')
const { protect, isOfficer } = require('../middleware/authMiddleware')

router.get('/',                              protect, getFees)
router.get('/summary',                       protect, getFeeSummary)
router.patch('/:bookingId/proof',            protect, submitPaymentProof)
router.patch('/:bookingId/verify',           protect, isOfficer, verifyPayment)

module.exports = router