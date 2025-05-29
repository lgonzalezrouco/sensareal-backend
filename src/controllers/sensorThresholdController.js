const sensorThresholdService = require('../services/sensorThresholdService');
const logger = require('../../config/logger');

const sensorThresholdController = {
  createThreshold: async (req, res) => {
    try {
      const threshold = await sensorThresholdService.createThreshold(
        req.user.id,
        req.body.sensorId,
        req.body.threshold,
        req.body.condition,
        req.body.type,
      );
      return res.status(201).json(threshold);
    } catch (error) {
      logger.error(`Error creating sensor threshold: ${error}`);
      return res.status(500).json({ message: 'Error creating sensor threshold' });
    }
  },

  getThresholdsBySensor: async (req, res) => {
    try {
      const thresholds = await sensorThresholdService.getThresholdsBySensor(
        req.user.id,
        req.params.sensorId,
      );
      return res.json(thresholds);
    } catch (error) {
      if (error.message === 'Sensor not found or does not belong to user') {
        return res.status(404).json({ message: error.message });
      }
      logger.error(`Error fetching sensor thresholds: ${error}`);
      return res.status(500).json({ message: 'Error fetching sensor thresholds' });
    }
  },

  deleteThreshold: async (req, res) => {
    try {
      await sensorThresholdService.deleteThreshold(req.user.id, req.params.id);
      return res.json({ message: 'Threshold deleted successfully' });
    } catch (error) {
      if (error.message === 'Threshold not found') {
        return res.status(404).json({ message: error.message });
      }
      logger.error('Error deleting sensor threshold:', error);
      return res.status(500).json({ message: 'Error deleting sensor threshold' });
    }
  },

  toggleThreshold: async (req, res) => {
    try {
      const threshold = await sensorThresholdService.toggleThreshold(
        req.user.id,
        req.params.id,
      );
      return res.json(threshold);
    } catch (error) {
      if (error.message === 'Threshold not found') {
        return res.status(404).json({ message: error.message });
      }
      logger.error('Error toggling sensor threshold:', error);
      return res.status(500).json({ message: 'Error toggling sensor threshold' });
    }
  },
};

module.exports = sensorThresholdController;
