const db = require('../../models');

const { Esp32Device, Sensor } = db;

class Esp32Service {
  static async register(espId, userId) {
    // Check if ESP32 is already registered
    const existingDevice = await Esp32Device.findOne({ where: { espId } });
    if (existingDevice) {
      throw new Error('ESP32 device already registered');
    }

    // Create new ESP32 device
    const device = await Esp32Device.create({
      espId,
      userId,
      status: 'INACTIVE',
    });

    return device;
  }

  async discoverSensors(espId, userId, sensors) {
    // Verify that the ESP32 device belongs to the user
    const esp32Device = await Esp32Device.findOne({
      where: { espId, userId },
    });

    if (!esp32Device) {
      throw new Error('ESP32 device not found or does not belong to user');
    }

    // Check if any of the sensors already exist for any user
    const existingSensors = await Sensor.findAll({
      where: {
        sensorId: sensors,
      },
    });

    if (existingSensors.length > 0) {
      const existingSensorIds = existingSensors.map((s) => s.sensorId);
      throw new Error(`Sensors with IDs ${existingSensorIds.join(', ')} are already registered by other users`);
    }

    // Create new sensor records
    await Promise.all(sensors.map((sensorId) => Sensor.create({
      sensorId,
      espId,
      userId,
      status: 'UNASSIGNED',
    })));

    // Get all unassigned sensors for this ESP32
    const unassignedSensors = await Sensor.findAll({
      where: {
        espId,
        userId,
        status: 'UNASSIGNED',
      },
    });

    return {
      message: 'Sensors discovered successfully',
      unassignedSensors: unassignedSensors.map((s) => s.sensorId),
    };
  }

  async updateSensorName(userId, sensorId, name) {
    // Find the sensor and verify it belongs to the user
    const sensor = await Sensor.findOne({
      where: { sensorId, userId },
    });

    if (!sensor) {
      throw new Error('Sensor not found or does not belong to user');
    }

    // Update the sensor name
    await sensor.update({ name });

    return {
      message: 'Sensor name updated successfully',
      sensor: {
        sensorId: sensor.sensorId,
        name: sensor.name,
      },
    };
  }
}

module.exports = new Esp32Service();
