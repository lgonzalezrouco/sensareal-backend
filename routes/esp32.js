const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../src/middleware/auth');
const esp32Controller = require('../src/controllers/esp32Controller');
const validateRequest = require('../src/middleware/validateRequest');

const router = express.Router();

/**
 * @swagger
 * /api/esp/register:
 *   post:
 *     summary: Register a new ESP32 device
 *     tags: [ESP32]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - espId
 *             properties:
 *               espId:
 *                 type: string
 *                 description: Unique identifier for the ESP32 device
 *     responses:
 *       201:
 *         description: ESP32 registered successfully
 *       400:
 *         description: Invalid request or device already registered
 */
router.post(
  '/register',
  auth,
  [
    body('espId').notEmpty().withMessage('ESP32 ID is required'),
  ],
  validateRequest,
  esp32Controller.register,
);

/**
 * @swagger
 * /api/esp/sensors/discover:
 *   post:
 *     summary: Discover new sensors for an ESP32 device
 *     tags: [ESP32]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - espId
 *               - sensors
 *             properties:
 *               espId:
 *                 type: string
 *                 description: ID of the ESP32 device
 *               sensors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of discovered sensor IDs
 *     responses:
 *       200:
 *         description: Sensors discovered successfully
 *       400:
 *         description: Invalid request or sensors already registered
 *       404:
 *         description: ESP32 device not found
 */
router.post(
  '/sensors/discover',
  auth,
  [
    body('espId').notEmpty().withMessage('ESP32 ID is required'),
    body('sensors').isArray().withMessage('Sensors must be an array'),
    body('sensors.*').isString().withMessage('Each sensor ID must be a string'),
  ],
  validateRequest,
  esp32Controller.discoverSensors,
);

/**
 * @swagger
 * /api/esp/sensors/name:
 *   put:
 *     summary: Update the name of a sensor
 *     tags: [ESP32]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *               - name
 *             properties:
 *               sensorId:
 *                 type: string
 *                 description: ID of the sensor to update
 *               name:
 *                 type: string
 *                 description: New name for the sensor
 *     responses:
 *       200:
 *         description: Sensor name updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Sensor not found
 */
router.put(
  '/sensors/name',
  auth,
  [
    body('sensorId').notEmpty().withMessage('Sensor ID is required'),
    body('name').notEmpty().withMessage('Sensor name is required'),
  ],
  validateRequest,
  esp32Controller.updateSensorName,
);

module.exports = router;
