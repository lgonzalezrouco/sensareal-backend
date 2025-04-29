const sensorService = require('../services/sensorService');
const logger = require('../../config/logger');

const getUserSensors = async (req, res) => {
  try {
    const sensors = await sensorService.getUserSensors(req.user.id);
    return res.json(sensors);
  } catch (error) {
    logger.error(`Error fetching user sensors: ${error}`);
    return res.status(500).json({ message: 'Error fetching user sensors' });
  }
};

const getSensorById = async (req, res) => {
  try {
    const sensor = await sensorService.getSensorById(req.params.id, req.user.id);
    return res.json(sensor);
  } catch (error) {
    if (error.message === 'Sensor not found') {
      return res.status(404).json({ message: error.message });
    }
    logger.error(`Error fetching sensor: ${error}`);
    return res.status(500).json({ message: 'Error fetching sensor' });
  }
};

module.exports = {
  getUserSensors,
  getSensorById,
};
