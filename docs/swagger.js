import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

// Function to convert Mongoose schemas to OpenAPI schemas
const mongooseToOpenAPI = (mongooseSchema) => {
    const openAPISchema = {
        type: 'object',
        properties: {},
        required: [],
    };

    mongooseSchema.eachPath((path, schemaType) => {
        if (path === '__v' || path === '_id') return; // Skip internal fields

        let type;
        let format;
        let enumValues = [];

        switch (schemaType.instance) {
            case 'String':
                type = 'string';
                if (schemaType.enumValues && schemaType.enumValues.length > 0) {
                    enumValues = schemaType.enumValues;
                }
                break;
            case 'Number':
                type = 'number';
                break;
            case 'Date':
                type = 'string';
                format = 'date-time';
                break;
            case 'Boolean':
                type = 'boolean';
                break;
            case 'Array':
                type = 'array';
                // Determine the type of items
                if (schemaType.caster.instance === 'String') {
                    openAPISchema.properties[path] = {
                        type: 'array',
                        items: { type: 'string' },
                    };
                }
                // Handle other array types as needed
                return; // Skip further processing
            case 'ObjectID':
                type = 'string';
                format = 'uuid'; // or 'objectid' as a custom format
                break;
            default:
                type = 'string';
        }

        //console.log(path, schemaType);

        openAPISchema.properties[path] = { type };
        if (format) {
            openAPISchema.properties[path].format = format;
        }
        if (enumValues.length > 0) {
            openAPISchema.properties[path].enum = enumValues;
        }
        if (schemaType.isRequired) {
            openAPISchema.required.push(path);
        }
    });

    //console.log(`OpenAPI schema: ${JSON.stringify(openAPISchema)}`);

    return openAPISchema;
};

// Initialize Swagger definitions
const initializeSwagger = () => {
    const versions = ['v1', 'v2']; // List your API versions here
    const swaggerDefinitions = {};

    versions.forEach(version => {
        // Path to version-specific controllers
        const controllersPath = path.resolve(`./controllers/api/${version}`);

        // Convert each Mongoose model to OpenAPI schema
        const models = fs.readdirSync(controllersPath).filter(file => file.endsWith('.js'));

        models.forEach(file => {
            const modelPath = path.join(controllersPath, file);
            const module = import(modelPath).then(module => { return module.default }).catch(err => { console.error(err); });
            if (module && module.schema) {
                swaggerDefinitions[module.modelName] = mongooseToOpenAPI(module.schema);
            }
        });
    });

   console.log(`Swagger definitions: ${JSON.stringify(swaggerDefinitions)}`);

    return swaggerDefinitions;
};

// Define Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GMS API Documentation',
            description: 'API Documentation for the GMS API',
            version: '1.0.0',
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
        components: {
            securitySchemes: {
                jwt: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                },
            },
            schemas: initializeSwagger(),
        },
    },
    // Paths to files containing OpenAPI definitions (JSDoc annotations)
    apis: ['./controllers/api/**/*.js'], // Adjust the path as needed
};

const specs = swaggerJSDoc(swaggerOptions);

// Setup Swagger UI
const setupSwagger = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;