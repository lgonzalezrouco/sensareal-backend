const db = require('../../models');

const { SensorThreshold, Sensor } = db;

class SensorThresholdService {
  static async createThreshold(userId, sensorId, threshold, condition) {
    // Check if sensor exists and belongs to user
    const sensor = await Sensor.findOne({
      where: { id: sensorId, userId },
    });

    if (!sensor) {
      throw new Error('Sensor not found or does not belong to user');
    }

    // Check if threshold already exists for this sensor
    const existingThreshold = await SensorThreshold.findOne({
      where: { sensorId, userId },
    });

    if (existingThreshold) {
      throw new Error('Threshold already exists for this sensor');
    }

    // Create new threshold
    const newThreshold = await SensorThreshold.create({
      userId,
      sensorId,
      threshold,
      condition,
      isActive: true,
    });

    return {
      message: 'Threshold created successfully',
      threshold: newThreshold,
    };
  }

  static async getThresholds(userId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;

    const { count, rows } = await SensorThreshold.findAndCountAll({
      where: { userId },
      include: [{
        model: Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'sensorId'],
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      count,
      results: rows,
    };
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
