const express = require('express');
const { auth } = require('../src/middleware/auth');
const sensorController = require('../src/controllers/sensorController');

const router = express.Router();

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Get all sensors for the authenticated user
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sensors
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
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   lastReading:
 *                     type: object
 *                     properties:
 *                       temperature:
 *                         type: number
 *                         format: float
 *                       humidity:
 *                         type: number
 *                         format: float
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, sensorController.getUserSensors);

module.exports = router;
