import express from 'express';
import {NotAcceptableError} from "../utils/errors.js";

/**
 * Parse the request body as JSON
 *
 * @param req
 * @param res
 * @param next
 * @type {function(*=, *=, *): Promise<void>}
 * @throws {NotAcceptableError} if the request body is not valid JSON
 * @returns {Promise<void>}
 */
const jsonParser = async (req, res, next) => {
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
        throw new NotAcceptableError('Request body must contain valid JSON')
            .withDetails('Please check the request body and try again')
            .withCode('INVALID_JSON');
    }

    next();
}

export default jsonParser;