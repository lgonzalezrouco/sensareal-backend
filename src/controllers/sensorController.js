const sensorService = require('../services/sensorService');
const logger = require('../../config/logger');

const sensorController = {
  async getUserSensors(req, res) {
    try {
      const sensors = await sensorService.getUserSensors(req.user.id);
      return res.json(sensors);
    } catch (error) {
      logger.error(`Error fetching user sensors: ${error}`);
      return res.status(500).json({ message: 'Error fetching user sensors' });
    }
  },

  async createSensor(req, res) {
    try {
      const { id, name } = req.body;
      const userId = req.user.id;

      const sensor = await sensorService.createSensor(userId, id, name);
      logger.info(`Sensor created: ${id}, ${userId}, ${name}`);
      return res.status(201).json(sensor);
    } catch (error) {
      logger.error(`Error creating sensor: ${error}`);
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error creating sensor' });
    }
  },

  async updateSensorName(req, res) {
    try {
      const { sensorId, name } = req.body;
      const userId = req.user.id;

      const result = await sensorService.updateSensorName(
        userId,
        sensorId,
        name,
      );
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

  async getSensorById(req, res) {
    try {
      const sensor = await sensorService.getSensorById(
        req.params.id,
        req.user.id,
      );
      return res.json(sensor);
    } catch (error) {
      if (error.message === 'Sensor not found') {
        return res.status(404).json({ message: error.message });
      }
      logger.error(`Error fetching sensor: ${error}`);
      return res.status(500).json({ message: 'Error fetching sensor' });
    }
  },
};

module.exports = sensorController;
