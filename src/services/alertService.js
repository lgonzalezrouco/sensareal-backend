const db = require('../../models');

const { EmailAlert, Sensor, User } = db;

class AlertService {
  static async getAlerts(userId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;

    const { count, rows } = await EmailAlert.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Sensor,
          as: 'sensor',
          attributes: ['id', 'name', 'sensorId'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['sentAt', 'DESC']],
      limit,
      offset,
    });

    return {
      count,
      results: rows,
    };
  }

  static async getSensorAlerts(userId, sensorId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;

    const { count, rows } = await EmailAlert.findAndCountAll({
      where: { userId, sensorId },
      include: [
        {
          model: Sensor,
          as: 'sensor',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['sentAt', 'DESC']],
      limit,
      offset,
    });

    return {
      count,
      results: rows,
    };
  }
}

module.exports = AlertService;
