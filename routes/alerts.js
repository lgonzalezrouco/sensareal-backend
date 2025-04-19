const express = require('express');

const router = express.Router();
const { auth } = require('../src/middleware/auth');
const AlertController = require('../src/controllers/alertController');

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailAlert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the alert
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who received the alert
 *         sensorId:
 *           type: string
 *           format: uuid
 *           description: ID of the sensor that triggered the alert
 *         thresholdValue:
 *           type: number
 *           format: float
 *           description: The threshold value that was set
 *         actualValue:
 *           type: number
 *           format: float
 *           description: The actual value that triggered the alert
 *         condition:
 *           type: string
 *           enum: [above, below]
 *           description: The condition that triggered the alert
 *         sentAt:
 *           type: string
 *           format: date-time
 *           description: When the alert was sent
 *         sensor:
 *           $ref: '#/components/schemas/Sensor'
 *         user:
 *           $ref: '#/components/schemas/User'
 *     Sensor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         sensorId:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 */

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get all alerts for the authenticated user
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 next:
 *                   type: string
 *                   nullable: true
 *                 previous:
 *                   type: string
 *                   nullable: true
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmailAlert'
 *       500:
 *         description: Server error
 */
router.get('/', auth, AlertController.getAlerts);

/**
 * @swagger
 * /api/sensors/{sensorId}/alerts:
 *   get:
 *     summary: Get all alerts for a specific sensor
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of alerts for the sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 next:
 *                   type: string
 *                   nullable: true
 *                 previous:
 *                   type: string
 *                   nullable: true
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmailAlert'
 *       500:
 *         description: Server error
 */
router.get('/sensors/:sensorId/alerts', auth, AlertController.getSensorAlerts);

module.exports = router;
