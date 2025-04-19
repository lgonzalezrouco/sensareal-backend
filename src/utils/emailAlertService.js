const db = require('../../models');
const EmailService = require('./emailService');

const {
  EmailAlert,
  SensorThreshold,
  User,
  Sensor,
} = db;

class EmailAlertService {
  static async checkAndSendAlert(sensorId, value) {
    // Find the sensor and its threshold
    const sensor = await Sensor.findOne({
      where: { id: sensorId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'name'],
      }],
    });

    if (!sensor || !sensor.user) {
      return;
    }

    const threshold = await SensorThreshold.findOne({
      where: {
        sensorId,
        isActive: true,
      },
    });

    if (!threshold) {
      return;
    }

    // Check if threshold condition is met
    const isThresholdMet = threshold.condition === 'above'
      ? value > threshold.threshold
      : value < threshold.threshold;

    if (!isThresholdMet) {
      return;
    }

    // Check if an email was sent in the last 4 hours
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const recentAlert = await EmailAlert.findOne({
      where: {
        userId: sensor.user.id,
        sensorId,
        sentAt: {
          [db.Sequelize.Op.gt]: fourHoursAgo,
        },
      },
    });

    if (recentAlert) {
      return;
    }

    // Send email alert
    const subject = `Sensor Alert: ${sensor.name}`;
    const message = `
      Hello ${sensor.user.name},
      
      Your sensor "${sensor.name}" has triggered an alert:
      - Current value: ${value}
      - Threshold: ${threshold.threshold}
      - Condition: ${threshold.condition}
      
      This alert was triggered at ${new Date().toLocaleString()}
    `;

    await EmailService.sendEmail(sensor.user.email, subject, message);

    // Record the alert
    await EmailAlert.create({
      userId: sensor.user.id,
      sensorId,
      thresholdValue: threshold.threshold,
      actualValue: value,
      condition: threshold.condition,
    });
  }
}

module.exports = EmailAlertService;
