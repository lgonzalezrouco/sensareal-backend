const logger = require('../../config/logger');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log the response when it's sent
  const originalSend = res.send;
  res.send = function(data) {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const responseTime = Date.now() - startTime;
    if (res.statusCode >= 200 && res.statusCode < 400) {
      logger.info(`${req.method} ${url} ${res.statusCode} ${responseTime}ms`);
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      logger.warn(`${req.method} ${url} ${res.statusCode} ${responseTime}ms`);
    } else {
      logger.error(`${req.method} ${url} ${res.statusCode} ${responseTime}ms`);
    }
    originalSend.apply(res, arguments);
  };

  next();
};

module.exports = requestLogger; 