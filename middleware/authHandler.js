// middleware/auth.js
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import {UnauthorizedError} from '../utils/errors.js';

/**
 * Authentication Middleware
 *
 * This middleware checks for the presence of a JWT in the HTTP-only cookies,
 * verifies its validity, retrieves the corresponding employee from the database,
 * and attaches the employee object to the request for use in subsequent handlers.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new UnauthorizedError('Authentication token is missing.')
            .withCode('TOKEN_MISSING')
            .withDetails('Please log in to access this resource.')
            .withDocsUrl('/api/v1/docs#login-an-employee');
    }

    await jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            throw new UnauthorizedError('Invalid authentication token.')
                .withDetails('Please log in again to access this resource.')
                .withDocsUrl('/api/v1/docs#login-an-employee')
                .withCode('INVALID_TOKEN');
        }

        req.auth = {};
        await Employee.findById(decoded.id).select('-password')
            .exec()
            .then(employee => {
                return req.auth.employee = employee;
            })
            .catch(error => {
                if (error) {
                    throw new UnauthorizedError('Employee associated with this token does not exist.')
                        .withCode('USER_NOT_FOUND')
                        .withDetails('Please log in again.')
                        .withDocsUrl('/api/v1/docs#login-an-employee');
                }
            });
    }).catch(error => {
        res.clearCookie('token');
        return next(error);
    });

    return next();
};

export default auth;