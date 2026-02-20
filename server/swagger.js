const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Smart Transit AI API',
        description: 'API Documentation for Smart Transit AI server',
        version: '1.0.0',
    },
    host: 'localhost:5000',
    basePath: '/',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./src/app.js']; // Pointing to app.js where all routes are defined

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

// Generate swagger-output.json
swaggerAutogen(outputFile, routes, doc);
