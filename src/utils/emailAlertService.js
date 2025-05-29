const db = require('../../models');
const EmailService = require('./emailService');

const {
  EmailAlert, SensorThreshold, User, Sensor,
} = db;

class EmailAlertService {
  static async checkAndSendAlert(id, value, type) {
    // Find the sensor and its threshold
    const sensor = await Sensor.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name'],
        },
      ],
    });

    if (!sensor || !sensor.user) {
      return;
    }

    const thresholds = await SensorThreshold.findAll({
      where: {
        sensorId: id,
        isActive: true,
        type,
      },
    });

    if (!thresholds || thresholds.length === 0) {
      return;
    }

    const surpassedThresholdMet = thresholds.filter((t) => {
      if (t.condition === 'above') {
        return value > t.threshold;
      }
      return value < t.threshold;
    });

    if (surpassedThresholdMet === 0) {
      return;
    }

    // Check if an email was sent in the last 4 hours
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const recentAlert = await EmailAlert.findOne({
      where: {
        userId: sensor.user.id,
        sensorId: id,
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
      - Type: ${type}

      ${surpassedThresholdMet.map((t) => `
      - Threshold: ${t.threshold}
      - Condition: ${t.condition}
      `)}
      
      This alert was triggered at ${new Date().toLocaleString()}
    `;

    await EmailService.sendEmail(sensor.user.email, subject, message);

    // Record the alert
    await Promise.all(surpassedThresholdMet.map((threshold) => EmailAlert.create({
      userId: sensor.user.id,
      sensorId: id,
      thresholdValue: threshold.threshold,
      actualValue: value,
      condition: threshold.condition,
    })));
  }
}

module.exports = EmailAlertService;
