require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const { testConnection } = require('./config/database');
const specs = require('./config/swagger');
const errorHandler = require('./src/middleware/errorHandler');
const requestLogger = require('./src/middleware/requestLogger');
const _mqttService = require('./src/utils/mqttService');

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
    await testConnection();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/esp', require('./routes/esp32'));
app.use('/api/sensor-data', require('./routes/sensorData'));
app.use('/api/alerts', require('./routes/alerts'));

// Error handling
app.use(errorHandler);

// Initialize the application
initializeApp();

module.exports = app;
