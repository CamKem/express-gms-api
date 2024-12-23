import expressJsdocSwagger from 'express-jsdoc-swagger';

// Swagger definition
const options = {
    info: {
        version: '1.0.0',
        title: 'GMS API Endpoints Docs',
        description: 'Documentation describing the API endpoints available in the grocery management system (GMS) API',
        license: {
            name: 'MIT',
            url: 'https://choosealicense.com/licenses/mit/'
        },
        contact: {
            name: 'GMS API Support',
            url: 'https://gms.iterated.tech',
            email: 'cam@iterated.tech'
        },
        externalDocs: {
            description: 'Written documentation for the GMS API',
            url: 'https://gms.iterated.tech/docs'
        }
    },
    servers: [
        {
            url: 'https://gms.iterated.tech/api/{version}',
            description: 'Production server',
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
        './docs/jsdoc/**/*.js',
        // './src/controllers/api/**/*.js',
        './src/models/**/*.js',
        './src/utils/**/*.js',
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