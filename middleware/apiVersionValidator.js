import fs from 'fs';
import path from 'node:path';
import { NotFoundError, UnprocessableEntityError } from '../utils/errors.js';
import { setValue } from '../utils/setValue.js';

const validateApiVersion = async (request, response, next) => {
    const version = setValue(request.url.split('/')[1], null);
    const versionNumber = setValue(parseInt(version.replace('v', ''), 10), 0);
    const currentVersion = setValue(process.env.API_VERSION, 'v1');
    const endpointDocsUrl = `/docs/api/${currentVersion}/`;
    const currentVersionNumber = setValue(currentVersion.split('v')[1], 1);

    if (!version || !/^v\d+$/.test(version)) {
        throw new NotFoundError('No API version specified')
            .withDetails('Please specify an API version and check the documentation')
            .withCode('VERSION_NOT_SPECIFIED')
            .withDocsUrl(endpointDocsUrl);
    }

    const folderPath = path.resolve('controllers', 'api', `v${versionNumber}`);
    if (!(versionNumber <= currentVersionNumber) || !(versionNumber > 0) || !fs.existsSync(folderPath)) {
        throw new UnprocessableEntityError('Invalid API version requested')
            .withDetails(`The current API version is ${currentVersion}`)
            .withCode('INVALID_API_VERSION')
            .withDocsUrl(endpointDocsUrl);
    }

    return await next();
}

export default validateApiVersion;