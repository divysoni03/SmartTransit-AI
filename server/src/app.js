const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const optimizeRoutes = require('./routes/optimize.routes');
const projectRoutes = require('./routes/project.routes');
const scenarioRoutes = require('./routes/scenario.routes');
const reportRoutes = require('./routes/report.routes');
const { errorConverter, errorHandler } = require('./middleware/error.middleware');
const requestLogger = require('./middleware/requestLogger.middleware');
const { ApiError } = require('./utils/apiResponse');
const config = require('./config/env');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Gzip compression
app.use(compression());

// Enable cors
app.use(cors());
app.options('*', cors());

// Use custom request logger
app.use(requestLogger);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/optimize', optimizeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/reports', reportRoutes);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', environment: config.env });
});

// Unknown API routes handler
app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Catch-all error handler
app.use(errorHandler);

module.exports = app;
