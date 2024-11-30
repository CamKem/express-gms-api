import express from 'express';
import fs from 'fs';
import {BadRequestError} from "../utils/errors.js";
import * as path from "node:path";

const apiRouter = express.Router();

apiRouter.use(async (req, res, next) => {
    try {
        const reqParts = req.url.split('/');
        const reqVersion = reqParts[1];
        const reqResource = reqParts[2];

        const currentVersion = process.env.CURRENT_VERSION || 'v1';
        const currentVersionNumber = parseInt(currentVersion.replace('v', ''), 10);

        if (!reqVersion || !/^v\d+$/.test(reqVersion)) {
            throw new BadRequestError('Please specify an API version');
        }

        const reqVersionNumber = parseInt(reqVersion.replace('v', ''), 10);
        if (!(reqVersionNumber <= currentVersionNumber) || !(reqVersionNumber > 0)) {
            throw new BadRequestError(
                'Please specify a valid API version', {
                    current_version: currentVersion,
                    request_version: reqVersion,
                })
        }

        const controllerPath = path.resolve(`./controllers/api_${reqVersion}/${reqResource}.js`);

        if (!fs.existsSync(controllerPath)) {
            throw new BadRequestError(
                'Please specify a valid resource', {
                    current_version: currentVersion,
                    request_resource: reqResource,
                });
        }

        const controllerModule = await import(controllerPath);
        const controller = controllerModule.default;

        if (!controller || !controller.stack) {
            console.log('Controller must be an Express router');
            throw new Error('Invalid controller configuration');
        }

        // Adjust request URL
        req.url = req.url.slice(`/v${reqVersionNumber}/${reqResource}`.length) || '/';

        // Invoke the controller with the request
        return controller(req, res, next);
    } catch (err) {
        next(err);
    }
});

//         // Dynamically import the controller module
//         const module = await import(controllerPath);
//         const controller = module.default;
//
//         // Validate the controller
//         if (!controller || typeof controller !== 'function' || !controller.stack) {
//             console.error('Controller must be an Express router');
//             return new InternalServerError('Invalid controller configuration');
//         }
//
//         // Create a temporary router to handle the request
//         const tempRouter = express.Router();
//         tempRouter.use('/', controller);
//
//         // Adjust request.url to match the controller's routes
//         const mountPathLength = (`/${reqVersion}/${reqResource}`).length;
//         const originalUrl = request.url;
//         request.url = request.url.slice(mountPathLength) || '/';
//
//         // Pass the request to the controller
//         tempRouter.handle(request, response, (err) => {
//             // Restore the original request.url
//             request.url = originalUrl;
//             if (err) {
//                 next(err);
//             }
//         });

export default apiRouter;