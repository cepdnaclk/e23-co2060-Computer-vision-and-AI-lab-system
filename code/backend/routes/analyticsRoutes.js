// backend/routes/analyticsRoutes.js
const router = require('express').Router()
const {
  getOverview, getBookingsByMonth, getEquipmentUsage,
  getBookingsByCategory, getUserActivity, getRecentActivity, getGpuUsage,
} = require('../controllers/analyticsController')
const { protect, isStaff } = require('../middleware/authMiddleware')

router.use(protect, isStaff)   // All analytics routes require staff+

router.get('/overview',              getOverview)
router.get('/bookings-by-month',     getBookingsByMonth)
router.get('/equipment-usage',       getEquipmentUsage)
router.get('/bookings-by-category',  getBookingsByCategory)
router.get('/user-activity',         getUserActivity)
router.get('/recent-activity',       getRecentActivity)
router.get('/gpu-usage',             getGpuUsage)

module.exports = router