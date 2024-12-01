import express from 'express';
import fs from 'fs';
import {NotFoundError, UnprocessableEntityError} from "../utils/errors.js";
import * as path from "node:path";
import * as fsPromises from "node:fs/promises";

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

    // NOTE: bfore too much business logic implemented
    //  consider moving to version specific routers:
    //     const versionRouter = express.Router();
    //     // Define routes for this version
    //     resourceFiles.forEach((file) => {
    //         const resource = path.basename(file, '.js');
    //         const resourceRouter = express.Router();
    //         // Dynamically import and use the controller
    //         versionRouter.use(`/${resource}`, resourceRouter);
    //     });
    //     apiRouter.use(`/${version}`, versionRouter);
});

const currentVersionNumber = Math.max(...Object.keys(routeMap)
    .map((version) => parseInt(version.replace('v', ''), 10)));
const currentVersion = `v${currentVersionNumber}`;

apiRouter.use(async (request, response, next) => {
    const version = request.url.split('/')[1];
    const versionNumber = parseInt(version.replace('v', ''), 10);

    if (!version || !/^v\d+$/.test(version)) {
        throw new NotFoundError('No API version specified')
            .withDetails('Please specify an an API version and check the documentation')
            .withCode('NO_API_VERSION');
    }

    const folderPath = path.resolve('controllers', `api_v${versionNumber}`);
    if (!(versionNumber <= currentVersionNumber) || !(versionNumber > 0) || !fs.existsSync(folderPath)) {
        throw new UnprocessableEntityError('Invalid API version requested')
            .withDetails(`The current API version is ${currentVersion}`)
            .withCode('INVALID_API_VERSION');
    }

    next();
});

for (const [version, resources] of Object.entries(routeMap)) {
    resources.forEach((resource) => {
        apiRouter.use(`/${version}/${resource}`, async (req, res, next) => {
            try {
                const controllerPath = path.resolve('controllers', `api_${version}`, `${resource}.js`);
                const controllerModule = await import(controllerPath);
                const controller = controllerModule.default;

                if (typeof controller !== 'function' || !(controller instanceof express.Router)) {
                        throw new Error('Invalid controller configuration');
                }

                // Adjust request URL
                req.url = req.url.slice(`/v${version}/${resource}`.length) || '/';

                return controller(req, res, next);
            } catch (err) {
                next(err);
            }
        });
    })
}

export { apiRouter, routeMap };