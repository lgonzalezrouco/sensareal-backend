const mqtt = require('mqtt');
const logger = require('../../config/logger');
const SensorReading = require('../../models/sensorReading');
const Esp32Device = require('../../models/esp32device');
const EmailAlertService = require('../utils/emailAlertService');

class MqttService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.connect();
  }

  connect() {
    const mqttUrl = process.env.MQTT_URL || 'mqtt://localhost:1883';
    const options = {
      clientId: `sensareal-backend-${Math.random().toString(16).slice(3)}`,
      clean: true,
      reconnectPeriod: 1000,
    };

    this.client = mqtt.connect(mqttUrl, options);

    this.client.on('connect', () => {
      this.connected = true;
      logger.info('Connected to MQTT broker');
      this.subscribe();
    });

    this.client.on('error', (error) => {
      this.connected = false;
      logger.error('MQTT connection error:', error);
    });

    this.client.on('close', () => {
      this.connected = false;
      logger.warn('MQTT connection closed');
    });

    this.client.on('message', this.handleMessage.bind(this));
  }

  subscribe() {
    // Subscribe to all ESP32 topics
    this.client.subscribe('esp/+/sensor/+/reading', (err) => {
      if (err) {
        logger.error('MQTT subscription error:', err);
      } else {
        logger.info('Subscribed to sensor readings topic');
      }
    });

    // Subscribe to device status updates
    this.client.subscribe('esp/+/status', (err) => {
      if (err) {
        logger.error('MQTT subscription error:', err);
      } else {
        logger.info('Subscribed to device status topic');
      }
    });

    // Subscribe to device heartbeats
    this.client.subscribe('esp/+/heartbeat', (err) => {
      if (err) {
        logger.error('MQTT subscription error:', err);
      } else {
        logger.info('Subscribed to device heartbeat topic');
      }
    });
  }

  async handleMessage(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const topicParts = topic.split('/');

      if (topicParts[0] === 'esp' && topicParts[2] === 'sensor' && topicParts[4] === 'reading') {
        await this.handleSensorReading(topicParts[1], topicParts[3], data);
      } else if (topicParts[0] === 'esp' && topicParts[2] === 'status') {
        await this.handleDeviceStatus(topicParts[1], data);
      } else if (topicParts[0] === 'esp' && topicParts[2] === 'heartbeat') {
        await this.handleDeviceHeartbeat(topicParts[1], data);
      }
    } catch (error) {
      logger.error('Error handling MQTT message:', error);
    }
  }

  async handleSensorReading(espId, sensorId, data) {
    try {
      const device = await Esp32Device.findOne({ where: { espId } });
      if (!device) {
        logger.warn(`Device not found for ESP ID: ${espId}`);
        return;
      }

      const sensor = await device.getSensors({ where: { sensorId } });
      if (!sensor || sensor.length === 0) {
        logger.warn(`Sensor not found: ${sensorId} for device: ${espId}`);
        return;
      }

      const sensorRecord = sensor[0];
      await SensorReading.create({
        sensorId: sensorRecord.id,
        userId: device.userId,
        temperature: data.temperature,
        humidity: data.humidity,
        batteryLevel: data.batteryLevel,
        signalStrength: data.signalStrength,
        timestamp: new Date(),
      });

      // Check thresholds for temperature and humidity
      if (data.temperature !== undefined) {
        await EmailAlertService.checkAndSendAlert(sensorRecord.id, data.temperature);
      }
      if (data.humidity !== undefined) {
        await EmailAlertService.checkAndSendAlert(sensorRecord.id, data.humidity);
      }

      logger.info(`Processed sensor reading for ${sensorId}`);
    } catch (error) {
      logger.error('Error processing sensor reading:', error);
    }
  }

  async handleDeviceStatus(espId, data) {
    try {
      await Esp32Device.update(
        {
          status: data.status,
          batteryLevel: data.batteryLevel,
          signalStrength: data.signalStrength,
        },
        { where: { espId } },
      );
      logger.info(`Updated device status for ${espId}`);
    } catch (error) {
      logger.error('Error updating device status:', error);
    }
  }

  async handleDeviceHeartbeat(espId, data) {
    try {
      await Esp32Device.update(
        {
          lastHeartbeat: new Date(),
          batteryLevel: data.batteryLevel,
          signalStrength: data.signalStrength,
        },
        { where: { espId } },
      );
      logger.info(`Updated device heartbeat for ${espId}`);
    } catch (error) {
      logger.error('Error updating device heartbeat:', error);
    }
  }

  publish(topic, message) {
    if (!this.connected) {
      logger.error('MQTT client not connected');
      return;
    }

    this.client.publish(topic, JSON.stringify(message), (err) => {
      if (err) {
        logger.error('MQTT publish error:', err);
      }
    });
  }
}

module.exports = new MqttService();
