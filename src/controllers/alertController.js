const AlertService = require('../services/alertService');

class AlertController {
  static async getAlerts(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user.id;

      const alerts = await AlertService.getAlerts(userId, parseInt(page, 10), parseInt(limit, 10));

      res.json({
        count: alerts.count,
        next: alerts.count > page * limit ? `/api/alerts?page=${parseInt(page, 10) + 1}&limit=${limit}` : null,
        previous: page > 1 ? `/api/alerts?page=${parseInt(page, 10) - 1}&limit=${limit}` : null,
        results: alerts.results,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSensorAlerts(req, res) {
    try {
      const { sensorId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user.id;

      const alerts = await AlertService.getSensorAlerts(userId, sensorId, parseInt(page, 10), parseInt(limit, 10));

      res.json({
        count: alerts.count,
        next: alerts.count > page * limit ? `/api/sensors/${sensorId}/alerts?page=${parseInt(page, 10) + 1}&limit=${limit}` : null,
        previous: page > 1 ? `/api/sensors/${sensorId}/alerts?page=${parseInt(page, 10) - 1}&limit=${limit}` : null,
        results: alerts.results,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AlertController;
