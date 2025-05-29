require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');
const errorHandler = require('./src/middleware/errorHandler');
const requestLogger = require('./src/middleware/requestLogger');
const { connectToDatabase } = require('./config/database');
const logger = require('./config/logger');
const mqttService = require('./src/services/mqttService');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Initialize database and models
const initializeApp = async () => {
  try {
    await connectToDatabase();
    await mqttService.connect();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sensor-data', require('./routes/sensorData'));
app.use('/api/sensor-thresholds', require('./routes/sensorThresholds'));
app.use('/api/sensors', require('./routes/sensors'));
app.use('/api/alerts', require('./routes/alerts'));

// Error handling
app.use(errorHandler);

// Logging for non-production environments
if (['development', 'test'].includes(process.env.NODE_ENV)) {
  app.use((req, res, next) => {
    try {
      const {
        method, url, headers, body,
      } = req;
      logger.debug(`Request Details:
Request: ${method} ${url}
Headers: ${JSON.stringify(headers, null, 2)}
Body: ${JSON.stringify(body, null, 2)}
      `);
    } catch (error) {
      logger.error(`Error logging request: ${error.message}`);
    }
    next();
  });
}

// Initialize the application
initializeApp();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server listing on port ${port}`);
});
