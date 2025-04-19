const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../src/middleware/auth');
const Alert = require('../models/alert');
const logger = require('../config/logger');

const router = express.Router();

/**
 * @swagger
 * /api/alerts/configure:
 *   post:
 *     summary: Configure new alert threshold
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - threshold
 *               - condition
 *               - email
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [temperature, humidity]
 *               threshold:
 *                 type: number
 *                 format: float
 *               condition:
 *                 type: string
 *                 enum: [above, below]
 *               email:
 *                 type: string
 *                 format: email
 */
router.post(
  '/configure',
  auth,
  [
    body('type').isIn(['temperature', 'humidity']),
    body('threshold').isFloat(),
    body('condition').isIn(['above', 'below']),
    body('email').isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        type, threshold, condition, email,
      } = req.body;
      const alert = await Alert.create({
        type,
        threshold,
        condition,
        email,
        userId: req.user.id,
      });

      return res.status(201).json(alert);
    } catch (error) {
      logger.error('Alert configuration error:', error);
      return res.status(500).json({ message: 'Error configuring alert' });
    }
  },
);

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get user's configured alerts
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { userId: req.user.id },
    });
    return res.json({ alerts });
  } catch (error) {
    logger.error('Alerts fetch error:', error);
    return res.status(500).json({ message: 'Error fetching alerts' });
  }
});

/**
 * @swagger
 * /api/alerts/{id}:
 *   delete:
 *     summary: Delete an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await alert.destroy();
    return res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    logger.error('Alert deletion error:', error);
    return res.status(500).json({ message: 'Error deleting alert' });
  }
});

/**
 * @swagger
 * /api/alerts/{id}/toggle:
 *   patch:
 *     summary: Toggle alert active status
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const alert = await Alert.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.isActive = !alert.isActive;
    await alert.save();
    return res.json(alert);
  } catch (error) {
    logger.error('Alert toggle error:', error);
    return res.status(500).json({ message: 'Error toggling alert' });
  }
});

module.exports = router;
