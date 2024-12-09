import express from 'express';
import fs from 'fs';
import * as path from "node:path";
import validateApiVersion from "../middleware/apiVersionValidator.js";
import jsonParser from "../middleware/jsonParser.js";
import contentNegotiator from "../middleware/contentNegotiator.js";

const apiRouter = express.Router();

apiRouter.use(validateApiVersion);
apiRouter.use(contentNegotiator);
apiRouter.use(jsonParser);

const registerControllers = () => {
    const controllersPath = path.resolve('./src/controllers/api');
    const apiVersionDirs = fs.readdirSync(controllersPath).filter(dir => dir.startsWith('v'));

    apiVersionDirs.forEach(apiVersionDir => {
        const versionPath = path.join(controllersPath, apiVersionDir);
        const resourceFiles = fs.readdirSync(versionPath).filter(file => file.endsWith('.js'));

        resourceFiles.forEach(file => {
            const controllerPath = path.join(versionPath, file);
            const resourceName = path.basename(file, '.js');

            const controllerModule = import(controllerPath);
            controllerModule.then(module => {
                module = module.default;

                if (typeof module !== 'function' || !(module instanceof express.Router)) {
                    throw new Error(`Invalid controller configuration: ${controllerPath}`);
                }

                apiRouter.use(`/${apiVersionDir}/${resourceName}`, module);
            })
                .catch(err => {
                    throw new Error(`Error loading controller: ${controllerPath}, ${err}`);
                });
        });
    });
};

registerControllers();

export default apiRouter;