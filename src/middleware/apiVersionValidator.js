import fs from 'fs';
import path from 'node:path';
import { NotFoundError, UnprocessableEntityError } from '../utils/errors/errors.js';
import { setValue } from '../utils/setValue.js';
import dotenv from "dotenv";

dotenv.config();

/**
 * Validates the API version requested by the client
 * @param request
 * @param response
 * @param next
 * @returns {Promise<*>}
 */
const validateApiVersion = async (request, response, next) => {
    const version = setValue(request.url.split('/')[1], null);
    const requestVersionNumber = setValue(parseInt(version.replace('v', ''), 10), 1);
    const currentVersion = setValue(process.env.API_VERSION, 'v1');
    const endpointDocsUrl = `/docs/api/${currentVersion}/`;
    const currentVersionNumber = setValue(parseInt(currentVersion.replace('v', ''), 10), 1);

    if (!version || !/^v\d+$/.test(version)) {
        throw new NotFoundError('No API version specified')
            .withDetails('Please specify an API version and check the documentation')
            .withCode('VERSION_NOT_SPECIFIED')
            .withDocsUrl(endpointDocsUrl);
    }

    const folderPath = path.resolve('src', 'controllers', 'api', `v${requestVersionNumber}`);
    const isVersionNumberVersion = (requestVersionNumber <= currentVersionNumber) && (requestVersionNumber > 0) && fs.existsSync(folderPath);
    if (!isVersionNumberVersion) {
        throw new UnprocessableEntityError('Invalid API version requested')
            .withDetails(`The current API version is ${currentVersion}`)
            .withCode('INVALID_API_VERSION')
            .withDocsUrl(endpointDocsUrl);
    }

    return await next();
}

export default validateApiVersion;