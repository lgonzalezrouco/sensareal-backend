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
      .isUUID()
      .withMessage('Invalid sensor ID'),
    body('threshold').isFloat().withMessage('Threshold must be a number'),
    body('condition').isIn(['above', 'below']).withMessage('Invalid condition'),
  ],
  validateRequest,
  sensorThresholdController.createThreshold,
);

/**
 * @swagger
 * /api/sensor-thresholds:
 *   get:
 *     summary: Get all sensor thresholds for the user
 *     tags: [Sensor Thresholds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of thresholds
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "count": 100,
 *                 "next": "/api/sensor-thresholds?page=2&limit=50",
 *                 "previous": null,
 *                 "results": [
 *                   {
 *                     "id": "uuid",
 *                     "sensorId": "uuid1",
 *                     "threshold": 25.5,
 *                     "condition": "above",
 *                     "isActive": true
 *                   }
 *                 ]
 *               }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "Unauthorized - Invalid or missing authentication token"
 *               }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "Error fetching sensor thresholds"
 *               }
 */
router.get('/', auth, sensorThresholdController.getThresholds);

/**
 * @swagger
 * /api/sensor-thresholds/{id}:
 *   delete:
 *     summary: Delete a sensor threshold
 *     tags: [Sensor Thresholds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 * /api/sensor-thresholds/{id}/toggle:
 *   patch:
 *     summary: Toggle a sensor threshold's active status
 *     tags: [Sensor Thresholds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
