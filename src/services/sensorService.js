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
   * Create a new sensor
   * @param {string} userId - The ID of the user
   * @param {string} id - The UUID of the sensor
   * @param {string} name - The name of the sensor
   * @returns {Promise<Object>} The created sensor
   * @throws {Error} If sensor with ID already exists
   */
  async createSensor(userId, id, name) {
    // Check if sensor with ID already exists
    const existingSensor = await Sensor.findOne({
      where: { id },
    });

    if (existingSensor) {
      throw new Error('Sensor with this ID already exists');
    }

    // Create new sensor
    const sensor = await Sensor.create({
      id,
      name,
      userId,
    });

    return sensor;
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

  async updateSensorName(userId, sensorId, name) {
    // Find the sensor and verify it belongs to the user
    const sensor = await Sensor.findOne({
      where: { id: sensorId, userId },
    });

    if (!sensor) {
      throw new Error('Sensor not found');
    }

    // Update the name
    await sensor.update({ name });

    return {
      message: 'Sensor name updated successfully',
      sensor: {
        id: sensor.id,
        name: sensor.name,
      },
    };
  }
}

module.exports = new SensorService();
