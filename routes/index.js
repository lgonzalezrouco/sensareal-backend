const express = require('express');
const authRoutes = require('./auth');
const sensorDataRoutes = require('./sensorData');
const alertRoutes = require('./alerts');
const sensorThresholdRoutes = require('./sensorThresholds');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/sensor-data', sensorDataRoutes);
router.use('/alerts', alertRoutes);
router.use('/sensor-thresholds', sensorThresholdRoutes);

module.exports = router;
