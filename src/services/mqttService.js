const mqtt = require('mqtt');
const logger = require('../../config/logger');
const { Sensor, SensorReading } = require('../../models');
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
    this.client.subscribe('sensor/+', (err) => {
      if (err) {
        logger.error('MQTT subscription error:', err);
      } else {
        logger.info('Subscribed to sensor readings topic');
      }
    });
  }

  async handleMessage(topic, message) {
    try {
      logger.info('Sensor reading received')
      const data = JSON.parse(message.toString());
      const topicParts = topic.split('/');
      if (topicParts[0] === 'sensor') {
        await this.handleSensorReading(topicParts[1], data);
      }
    } catch (error) {
      logger.error('Error handling MQTT message:', error);
    }
  }

  async handleSensorReading(id, data) {
    try {
      const sensor = await Sensor.findOne({ where: { id:id } });
      if (!sensor) {
        logger.warn(`Sensor not found: ${id}`);
        return;
      }

      await SensorReading.create({
        sensorId: sensor.id,
        userId: sensor.userId,
        temperature: data.temperature,
        humidity: data.humidity,
        batteryLevel: data.batteryLevel,
        signalStrength: data.signalStrength,
        timestamp: new Date(),
      });
      logger.info(`id from handlesensorreading, ${id}`)

      // Check thresholds for temperature and humidity
      if (data.temperature !== undefined) {
        await EmailAlertService.checkAndSendAlert(sensor.id, data.temperature, 'temperature');
      }
      logger.info(`id from handlesensorreading, ${id}`)
      if (data.humidity !== undefined) {
        await EmailAlertService.checkAndSendAlert(sensor.id, data.humidity, 'humidity');
      }

      logger.info(`Processed sensor reading for ${id}`);
    } catch (error) {
      logger.error(`Error processing sensor reading:, ${error}`);
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
