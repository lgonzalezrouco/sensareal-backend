const sensorThresholdService = require('../services/sensorThresholdService');
const logger = require('../../config/logger');

const sensorThresholdController = {
  createThreshold: async (req, res) => {
    try {
      const threshold = await sensorThresholdService.createThreshold({
        ...req.body,
        userId: req.user.id,
      });
      return res.status(201).json(threshold);
    } catch (error) {
      logger.error('Error creating sensor threshold:', error);
      return res.status(500).json({ message: 'Error creating sensor threshold' });
    }
  },

  getThresholds: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 50;

      const { count, rows: thresholds } = await sensorThresholdService.getThresholds(
        req.user.id,
        page,
        limit,
      );

      const totalPages = Math.ceil(count / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const next = nextPage
        ? `${baseUrl}?page=${nextPage}&limit=${limit}`
        : null;
      const previous = prevPage
        ? `${baseUrl}?page=${prevPage}&limit=${limit}`
        : null;

      return res.json({
        count,
        next,
        previous,
        results: thresholds,
      });
    } catch (error) {
      logger.error('Error fetching sensor thresholds:', error);
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
