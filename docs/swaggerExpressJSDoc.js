// swaggerExpressJSDoc.js

import expressJsdocSwagger from 'express-jsdoc-swagger';

// Swagger definition
const options = {
    info: {
        version: '1.0.0',
        title: 'GMS API Documentation',
        description: 'API Documentation for the GMS API',
    },
    servers: [
        {
            url: 'http://localhost:3000/api/{version}',
            description: 'Development server',
            variables: {
                version: {
                    enum: [
                        'v1',
                        'v2'
                    ],
                    default: 'v2',
                    description: 'API version',
                }
            }
        },
    ],
    security: {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: "JWT"
        }
    },
    baseDir: process.cwd(), // Your project's root directory
    filesPattern: [
        './controllers/api/**/*.js', // Path to your route files
        './models/**/*.js', // Path to your model files
        './middleware/**/*.js', // Path to your middleware files
        './utils/**/*.js', // Path to your utility files
    ],
    swaggerUIPath: '/api-docs', // Endpoint for Swagger UI rendering
    exposeSwaggerUI: true,
    exposeApiDocs: true,
    apiDocsPath: '/api-docs/raw', // Endpoint for accessing API docs
    notRequiredAsNullable: false,
};

// Initialize Swagger
const setupExpressJSDocSwagger = (app) => {
    expressJsdocSwagger(app)(options);
    console.log('express-jsdoc-swagger is available at /api-docs');
};

export default setupExpressJSDocSwagger;