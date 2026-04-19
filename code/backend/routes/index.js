const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const bookingRoutes = require('./bookingRoutes');
const inventoryRoutes = require('./inventoryRoutes');

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/inventory', inventoryRoutes);

module.exports = router;
