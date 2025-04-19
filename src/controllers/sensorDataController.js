const logger = require('../../config/logger');
const SensorDataService = require('../services/sensorDataService');

const sensorDataController = {
  async getSensorReadings(req, res) {
    try {
      const { sensorId } = req.params;
      const {
        startDate, endDate, page, limit,
      } = req.query;

      const result = await SensorDataService.getSensorReadings(sensorId, {
        startDate,
        endDate,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });

      logger.info(`Retrieved readings for sensor ${sensorId}`);
      return res.json(result);
    } catch (error) {
      logger.error(`Error retrieving sensor readings: ${error.message}`);
      return res.status(500).json({ message: 'Error retrieving sensor readings' });
    }
  },

  async getAllReadings(req, res) {
    try {
      const {
        startDate, endDate, page, limit,
      } = req.query;

      const result = await SensorDataService.getAllReadings({
        startDate,
        endDate,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });

      logger.info('Retrieved all sensor readings');
      return res.json(result);
    } catch (error) {
      logger.error(`Error retrieving all readings: ${error.message}`);
      return res.status(500).json({ message: 'Error retrieving all readings' });
    }
  },
};

module.exports = sensorDataController;
