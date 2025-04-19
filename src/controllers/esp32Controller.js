const logger = require('../../config/logger');
const Esp32Service = require('../services/esp32Service');

const esp32Controller = {
  async register(req, res) {
    try {
      const { espId } = req.body;
      const userId = req.user.id; // From auth middleware

      const device = await Esp32Service.register(espId, userId);
      logger.info(`ESP32 device registered: ${espId} for user: ${userId}`);

      return res.status(201).json({
        message: 'ESP32 registered successfully',
        device,
      });
    } catch (error) {
      logger.error(`Error registering ESP32: ${error.message}`);
      return res.status(error.message === 'ESP32 device already registered' ? 400 : 500)
        .json({ message: error.message || 'Error registering ESP32 device' });
    }
  },

  async discoverSensors(req, res) {
    try {
      const { espId, sensors } = req.body;
      const userId = req.user.id; // From auth middleware

      const result = await Esp32Service.discoverSensors(espId, userId, sensors);
      logger.info(`Sensors discovered for ESP32 ${espId}: ${sensors.join(', ')}`);

      return res.json(result);
    } catch (error) {
      logger.error(`Error discovering sensors: ${error.message}`);
      return res.status(error.message.includes('not found') ? 404 : 500)
        .json({ message: error.message || 'Error discovering sensors' });
    }
  },

  async updateSensorName(req, res) {
    try {
      const { sensorId, name } = req.body;
      const userId = req.user.id;

      const result = await Esp32Service.updateSensorName(userId, sensorId, name);
      logger.info('Sensor name updated:', { sensorId, userId, name });
      res.json(result);
    } catch (error) {
      logger.error('Error updating sensor name:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },
};

module.exports = esp32Controller;
