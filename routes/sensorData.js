const express = require('express');
const { auth } = require('../src/middleware/auth');
const sensorDataController = require('../src/controllers/sensorDataController');

const router = express.Router();

/**
 * @swagger
 * /api/sensor-data/sensor/{sensorId}:
 *   get:
 *     summary: Get readings from a specific sensor
 *     tags: [Sensor Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Successfully retrieved sensor readings
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "count": 100,
 *                 "next": "/api/sensor-data/sensor/sensor_123?page=2&limit=50",
 *                 "previous": null,
 *                 "results": [
 *                   {
 *                     "id": 1,
 *                     "sensorId": "sensor_123",
 *                     "temperature": 25.5,
 *                     "humidity": 60.2,
 *                     "timestamp": "2024-03-30T15:30:00Z"
 *                   },
 *                   {
 *                     "id": 2,
 *                     "sensorId": "sensor_123",
 *                     "temperature": 26.1,
 *                     "humidity": 59.8,
 *                     "timestamp": "2024-03-30T15:35:00Z"
 *                   }
 *                 ]
 *               }
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "Unauthorized - Invalid or missing authentication token"
 *               }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "Error retrieving sensor readings"
 *               }
 */
router.get('/sensor/:sensorId', auth, sensorDataController.getSensorReadings);

/**
 * @swagger
 * /api/sensor-data/all:
 *   get:
 *     summary: Get all sensor readings
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
 *         description: Successfully retrieved all sensor readings
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "count": 100,
 *                 "next": "/api/sensor-data/all?page=2&limit=50",
 *                 "previous": null,
 *                 "results": [
 *                   {
 *                     "id": 1,
 *                     "sensorId": "sensor_123",
 *                     "temperature": 25.5,
 *                     "humidity": 60.2,
 *                     "timestamp": "2024-03-30T15:30:00Z"
 *                   },
 *                   {
 *                     "id": 2,
 *                     "sensorId": "sensor_456",
 *                     "temperature": 26.1,
 *                     "humidity": 59.8,
 *                     "timestamp": "2024-03-30T15:35:00Z"
 *                   }
 *                 ]
 *               }
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "Unauthorized - Invalid or missing authentication token"
 *               }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "Error retrieving all readings"
 *               }
 */
router.get('/all', auth, sensorDataController.getAllReadings);

module.exports = router;
