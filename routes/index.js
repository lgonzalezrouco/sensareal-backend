const express = require('express');
const authRoutes = require('./auth');
const sensorDataRoutes = require('./sensorData');
const esp32Routes = require('./esp32');
const alertRoutes = require('./alerts');
const sensorThresholdRoutes = require('./sensorThresholds');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/sensor-data', sensorDataRoutes);
router.use('/esp32', esp32Routes);
router.use('/alerts', alertRoutes);
router.use('/sensor-thresholds', sensorThresholdRoutes);

module.exports = router;
