import express from 'express';
import fs from 'fs';
import {NotFoundError, UnprocessableEntityError} from "../utils/errors.js";
import * as path from "node:path";
import * as fsPromises from "node:fs/promises";
import jsonParser from "../middleware/jsonParser.js";
import {setValue} from "../utils/setValue.js";
import contentNegotiator from "../middleware/contentNegotiator.js";

const apiRouter = express.Router();

const routeMap = {};

const controllersPath = path.resolve('./controllers');
const apiVersionDirs = (await fsPromises.readdir(controllersPath)).filter((dir) => dir.startsWith('api_v'));

apiVersionDirs.forEach((apiVersionDir) => {
    const version = apiVersionDir.replace('api_', '');
    const versionPath = path.resolve(`./controllers/${apiVersionDir}`);
    const resourceFiles = fs.readdirSync(versionPath).filter((file) => file.endsWith('.js'));

    routeMap[version] = [];

    resourceFiles.forEach((file) => {
        const resource = path.basename(file, '.js');
        routeMap[version].push(resource);
    });
});

const currentVersionNumber = Math.max(...Object.keys(routeMap)
    .map((version) => parseInt(version.replace('v', ''), 10)));
const currentVersion = setValue(`v${currentVersionNumber}`, 'v1');

apiRouter.use(async (request, response, next) => {
    const version = setValue(request.url.split('/')[1], null);
    const versionNumber = setValue(parseInt(version.replace('v', ''), 10), 0);
    const endpointDocsUrl = `/docs/api/${currentVersion}/`;

    if (!version || !/^v\d+$/.test(version)) {
        throw new NotFoundError('No API version specified')
            .withDetails('Please specify an an API version and check the documentation')
            .withCode('VERSION_NOT_SPECIFIED')
            .withDocsUrl(endpointDocsUrl);
    }

    const folderPath = path.resolve('controllers', `api_v${versionNumber}`);
    if (!(versionNumber <= currentVersionNumber) || !(versionNumber > 0) || !fs.existsSync(folderPath)) {
        throw new UnprocessableEntityError('Invalid API version requested')
            .withDetails(`The current API version is ${currentVersion}`)
            .withCode('INVALID_API_VERSION')
            .withDocsUrl(endpointDocsUrl);
    }

    next();
});

for (const [version, resources] of Object.entries(routeMap)) {
    resources.forEach((resource) => {
        const routePath = `/${version}/${resource}`;
        const resourceRouter = express.Router();

        resourceRouter.use(contentNegotiator);
        resourceRouter.use(jsonParser);

        resourceRouter.use(async (req, res, next) => {
            const controllerPath = path.resolve('controllers', `api_${version}`, `${resource}.js`);

            const controllerModule = await import(controllerPath);
            const controller = controllerModule.default;

            if (typeof controller !== 'function' || !(controller instanceof express.Router)) {
                const error = new Error('Invalid controller configuration');
                return next(error);
            }

            return controller(req, res, next);
        });

        apiRouter.use(routePath, resourceRouter);
    });
}

export { apiRouter, routeMap };