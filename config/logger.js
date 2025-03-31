const pino = require('pino');
const path = require('path');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: process.env.LOG_LEVEL || 'info',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      },
      {
        target: 'pino-roll',
        level: process.env.LOG_LEVEL || 'info',
        options: {
          file: path.join(__dirname, '../logs/app.log'),
          frequency: 'daily',
          size: '10M',
          timestamp: true,
          compress: true,
          mkdir: true,
          // Keep logs for 30 days
          maxFiles: 30,
          // Format for rotated files: app-YYYY-MM-DD.log.gz
          format: 'app-%Y-%m-%d.log.gz'
        },
      }
    ]
  }
});

module.exports = logger; 