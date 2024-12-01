import { v5 as uuidv5 } from 'uuid';
import {setValue} from "../utils/setValue.js";

/**
 * Sets a unique request ID for each request
 * @param req
 * @param res
 * @param next
 * @type {function(*, *, *): void}
 * @returns {void}
 */
const setUniqueRequestId = (req, res, next) => {
    req.requestId = setValue(req.requestId, uuidv5(Date.now().toString(), uuidv5.URL));
    next();
}

export default setUniqueRequestId;