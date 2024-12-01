import express from 'express';
import { NotFoundError } from '../utils/errors.js';

const fallbackRouter = express.Router();

fallbackRouter.use((req, res, next) => {
    next(new NotFoundError()
        .withDetails('Oops! The resource you are looking for does not exist, or has been moved. Please refer to the API documentation for more information.')
        .withCode('RESOURCE_NOT_FOUND')
    );
});

export default fallbackRouter;