// backend/routes/consultationRoutes.js
const router = require('express').Router()
const {
  getConsultations, createConsultation, updateStatus,
  cancelConsultation, getStaffAvailability,
} = require('../controllers/consultationController')
const { protect, isStaff } = require('../middleware/authMiddleware')

router.get('/',                             protect, getConsultations)
router.post('/',                            protect, createConsultation)
router.patch('/:id/status',                 protect, isStaff, updateStatus)
router.delete('/:id',                       protect, cancelConsultation)
router.get('/staff/:staffId/availability',  protect, getStaffAvailability)

module.exports = router