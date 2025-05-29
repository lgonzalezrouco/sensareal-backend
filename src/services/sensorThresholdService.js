const db = require('../../models');

const { SensorThreshold, Sensor } = db;

class SensorThresholdService {
  static async createThreshold(userId, id, threshold, condition, type) {
    // Check if sensor exists and belongs to user
    const sensor = await Sensor.findOne({
      where: { id, userId },
    });

    if (!sensor) {
      throw new Error('Sensor not found or does not belong to user');
    }

    // Create new threshold
    const newThreshold = await SensorThreshold.create({
      userId,
      sensorId: sensor.id,
      threshold,
      condition,
      type,
      isActive: true,
    });

    return {
      message: 'Threshold created successfully',
      threshold: newThreshold,
    };
  }

  static async getThresholdsBySensor(userId, sensorId) {
    // Check if sensor exists and belongs to user
    const sensor = await Sensor.findOne({
      where: { id: sensorId, userId },
    });

    if (!sensor) {
      throw new Error('Sensor not found or does not belong to user');
    }

    const thresholds = await SensorThreshold.findAll({
      where: { userId, sensorId },
      include: [{
        model: Sensor,
        as: 'sensor',
        attributes: ['id', 'name'],
      }],
      order: [['createdAt', 'DESC']],
    });
    return thresholds;
  }

  static async deleteThreshold(userId, thresholdId) {
    const threshold = await SensorThreshold.findOne({
      where: { id: thresholdId, userId },
    });

    if (!threshold) {
      throw new Error('Threshold not found or does not belong to user');
    }

    await threshold.destroy();

    return {
      message: 'Threshold deleted successfully',
    };
  }

  static async toggleThreshold(userId, thresholdId) {
    const threshold = await SensorThreshold.findOne({
      where: { id: thresholdId, userId },
    });

    if (!threshold) {
      throw new Error('Threshold not found or does not belong to user');
    }

    await threshold.update({ isActive: !threshold.isActive });

    return {
      message: 'Threshold status updated successfully',
      threshold: {
        id: threshold.id,
        isActive: threshold.isActive,
      },
    };
  }
}

module.exports = SensorThresholdService;
