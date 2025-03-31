const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { auth, isAdmin } = require('../src/middleware/auth');
const SensorReading = require('../models/sensorReading');
const logger = require('../config/logger');
const User = require('../models/user');

const router = express.Router();

/**
 * @swagger
 * /api/sensor-data:
 *   post:
 *     summary: Submit new sensor reading
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - temperature
 *               - humidity
 *             properties:
 *               temperature:
 *                 type: number
 *                 format: float
 *               humidity:
 *                 type: number
 *                 format: float
 *               timestamp:
 *                 type: string
 *                 format: date-time
 */
router.post(
  '/',
  auth,
  [
    body('temperature').isFloat(),
    body('humidity').isFloat(),
    body('timestamp').optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { temperature, humidity, timestamp } = req.body;
      const reading = await SensorReading.create({
        temperature,
        humidity,
        timestamp: timestamp || new Date(),
        userId: req.user.id,
      });

      return res.status(201).json(reading);
    } catch (error) {
      logger.error('Sensor reading creation error:', error);
      return res.status(500).json({ message: 'Error creating sensor reading' });
    }
  },
);

/**
 * @swagger
 * /api/sensor-data/history:
 *   get:
 *     summary: Get historical sensor readings
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 */
router.get('/history', auth, async (req, res) => {
  try {
    const {
      startDate, endDate, limit = 100, offset = 0,
    } = req.query;
    const where = { userId: req.user.id };

    if (startDate) where.timestamp = { ...where.timestamp, [Op.gte]: new Date(startDate) };
    if (endDate) where.timestamp = { ...where.timestamp, [Op.lte]: new Date(endDate) };

    const { count, rows } = await SensorReading.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['timestamp', 'DESC']],
    });

    return res.json({
      readings: rows,
      total: count,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
  } catch (error) {
    logger.error('Sensor history fetch error:', error);
    return res.status(500).json({ message: 'Error fetching sensor history' });
  }
});

/**
 * @swagger
 * /api/sensor-data/all:
 *   get:
 *     summary: Get all sensor readings (admin only)
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 */
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const readings = await SensorReading.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'name'],
      }],
      order: [['timestamp', 'DESC']],
    });
    res.json(readings);
  } catch (error) {
    logger.error('Admin sensor data fetch error:', error);
    res.status(500).json({ message: 'Error fetching all sensor data' });
  }
});

module.exports = router;
