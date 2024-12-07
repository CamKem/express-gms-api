import expressJsdocSwagger from 'express-jsdoc-swagger';

// Swagger definition
const options = {
    info: {
        version: '1.0.0',
        title: 'GMS API Endpoints Docs',
        description: 'Documentation describing the API endpoints available in the grocery management system (GMS) API',
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
    basePath: '/api/{version}', // Base path for the API
    filesPattern: [
        './docs/jsdoc/**/*.js',
        // './controllers/api/**/*.js',
        './models/**/*.js',
        './utils/**/*.js',

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
};

export default setupExpressJSDocSwagger;