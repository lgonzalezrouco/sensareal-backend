const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../src/middleware/auth');
const sensorThresholdController = require('../src/controllers/sensorThresholdController');
const validateRequest = require('../src/middleware/validateRequest');

const router = express.Router();

/**
 * @swagger
 * /api/sensor-thresholds:
 *   post:
 *     summary: Create a new sensor threshold
 *     tags: [Sensor Thresholds]
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
 *               - threshold
 *               - condition
 *               - type
 *             properties:
 *               sensorId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the sensor
 *               threshold:
 *                 type: number
 *                 format: float
 *               condition:
 *                 type: string
 *                 enum: [above, below]
 *               type:
 *                 type: string
 *                 enum: [temperature, humidity]
 *     responses:
 *       201:
 *         description: Threshold created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 sensorId:
 *                   type: string
 *                   format: uuid
 *                 threshold:
 *                   type: number
 *                   format: float
 *                 condition:
 *                   type: string
 *                   enum: [above, below]
 *                 type:
 *                   type: string
 *                   enum: [temperature, humidity]
 *                 isActive:
 *                   type: boolean
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  auth,
  [
    body('sensorId')
      .notEmpty()
      .withMessage('Sensor ID is required'),
    body('threshold').isFloat().withMessage('Threshold must be a number'),
    body('condition').isIn(['above', 'below']).withMessage('Invalid condition'),
    body('type').isIn(['temperature', 'humidity']).withMessage('Invalid type'),
  ],
  validateRequest,
  sensorThresholdController.createThreshold,
);

/**
 * @swagger
 * /api/sensor-thresholds/{sensorId}:
 *   get:
 *     summary: Get all thresholds for a specific sensor
 *     tags: [Sensor Thresholds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of thresholds for the sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   sensorId:
 *                     type: string
 *                     format: uuid
 *                   threshold:
 *                     type: number
 *                     format: float
 *                   condition:
 *                     type: string
 *                     enum: [above, below]
 *                   type:
 *                     type: string
 *                     enum: [temperature, humidity]
 *                   isActive:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Server error
 */
router.get('/:sensorId', auth, sensorThresholdController.getThresholdsBySensor);

/**
 * @swagger
 * /api/sensor-thresholds/{thresholdId}:
 *   delete:
 *     summary: Delete a sensor threshold
 *     tags: [Sensor Thresholds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: thresholdId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Threshold deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Threshold not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, sensorThresholdController.deleteThreshold);

/**
 * @swagger
 * /api/sensor-thresholds/{thresholdId}/toggle:
 *   patch:
 *     summary: Toggle a sensor threshold's active status
 *     tags: [Sensor Thresholds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: thresholdId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Threshold toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Threshold not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/toggle', auth, sensorThresholdController.toggleThreshold);

module.exports = router;
