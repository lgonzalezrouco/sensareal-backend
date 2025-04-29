const { Sensor, SensorReading } = require('../../models');

class SensorService {
  /**
   * Get all sensors for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} Array of sensors with their last readings
   */
  async getUserSensors(userId) {
    const sensors = await Sensor.findAll({
      where: { userId },
      include: [{
        model: SensorReading,
        as: 'readings',
        limit: 1,
        order: [['createdAt', 'DESC']],
        attributes: ['temperature', 'humidity', 'createdAt'],
      }],
      order: [['createdAt', 'DESC']],
    });

    return sensors.map((sensor) => {
      const sensorJson = sensor.toJSON();
      // If there's no reading, set default values
      if (!sensorJson.readings || sensorJson.readings.length === 0) {
        sensorJson.readings = {
          temperature: null,
          humidity: null,
          timestamp: null,
        };
      } else {
        // Format the last reading
        const reading = sensorJson.readings[0];
        sensorJson.readings = {
          temperature: reading.temperature,
          humidity: reading.humidity,
          timestamp: reading.createdAt,
        };
      }
      return sensorJson;
    });
  }

  /**
   * Get a sensor by ID
   * @param {string} sensorId - The ID of the sensor
   * @param {string} userId - The ID of the user (for authorization)
   * @returns {Promise<Object>} The sensor object
   * @throws {Error} If sensor is not found or user is not authorized
   */
  async getSensorById(sensorId, userId) {
    const sensor = await Sensor.findOne({
      where: { id: sensorId, userId },
      include: [{
        model: SensorReading,
        as: 'readings',
        limit: 1,
        order: [['createdAt', 'DESC']],
        attributes: ['temperature', 'humidity', 'createdAt'],
      }],
    });

    if (!sensor) {
      throw new Error('Sensor not found');
    }

    const sensorJson = sensor.toJSON();
    if (!sensorJson.readings || sensorJson.readings.length === 0) {
      sensorJson.readings = {
        temperature: null,
        humidity: null,
        timestamp: null,
      };
    } else {
      const reading = sensorJson.readings[0];
      sensorJson.readings = {
        temperature: reading.temperature,
        humidity: reading.humidity,
        timestamp: reading.createdAt,
      };
    }

    return sensorJson;
  }
}

module.exports = new SensorService();
