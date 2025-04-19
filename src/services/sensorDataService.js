const { Op } = require('sequelize');
const { SensorReading } = require('../../models');

class SensorDataService {
  async getSensorReadings(sensorId, {
    startDate, endDate, page = 1, limit = 50,
  }) {
    const offset = (page - 1) * limit;
    const where = { sensorId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await SensorReading.findAndCountAll({
      where,
      limit,
      offset,
      order: [['timestamp', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    return {
      count,
      next: nextPage ? `/api/sensor-data/sensor/${sensorId}?page=${nextPage}&limit=${limit}` : null,
      previous: previousPage ? `/api/sensor-data/sensor/${sensorId}?page=${previousPage}&limit=${limit}` : null,
      results: rows,
    };
  }

  async getAllReadings({
    startDate, endDate, page = 1, limit = 50,
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await SensorReading.findAndCountAll({
      where,
      limit,
      offset,
      order: [['timestamp', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    return {
      count,
      next: nextPage ? `/api/sensor-data/all?page=${nextPage}&limit=${limit}` : null,
      previous: previousPage ? `/api/sensor-data/all?page=${previousPage}&limit=${limit}` : null,
      results: rows,
    };
  }
}

module.exports = new SensorDataService();
