import {NotAcceptableError, UnsupportedMediaTypeError} from "../utils/errors.js";
import express from 'express';

/**
 *  Middleware to check the request content type
 *  JSDoc
 *  @param {Request} req - The request object
 *  @param {Response} res - The response object
 *  @param {NextFunction} next - The next function
 */
const contentTypeHandler = async (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.headers['content-type'] || req.headers['content-type'] !== 'application/json') {
            // 415 Unsupported Media Type
            throw new UnsupportedMediaTypeError('Content-Type must be application/json');
        }

        // Check if the request body is valid JSON & set req.body
        const validJson = await new Promise((resolve) => {
            express.json()(req, res, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });

        if (!validJson) {
            throw new NotAcceptableError('Request body must contain valid JSON');
        }
    }

    if (req.accepts('application/json') === undefined) {
        throw new NotAcceptableError('Accept header must allow application/json');
    }

    next();
};

export default contentTypeHandler;