import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import {ForbiddenError, UnauthorizedError} from '../utils/errors.js';

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
    const authCookie = req.headers.cookie?.split('=');
    const authCookieValue = authCookie?.[0] === 'token' ? authCookie[1] : null;
    const authHeader = req.headers.authorization;

    let token = null;

    if (!authCookieValue && !authHeader) {
        throw new ForbiddenError('Authorization not provided.')
            .withCode('AUTHORIZATION_NOT_PROVIDED')
            .withDetails('You need to provide a token in the Authorization header or a cookie.')
            .withDocsUrl('/api/v1/docs#login-an-employee');
    }

    if (authCookieValue) {
        token = authCookieValue;
    } else if (authHeader) {
        if (!authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Authorization header is invalid.')
                .withCode('AUTHORIZATION_HEADER_INVALID')
                .withDetails('Unauthorized: Bearer keyword is missing.')
                .withDocsUrl('/api/v1/docs#login-an-employee');
        } else if (!authHeader.split(' ')[1]) {
            throw new UnauthorizedError('Authorization header is invalid.')
                .withCode('AUTHORIZATION_HEADER_INVALID')
                .withDetails('Unauthorized: Bearer token is missing.')
                .withDocsUrl('/api/v1/docs#login-an-employee');
        }

        token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedError('Authorization header is invalid.')
                .withCode('AUTHORIZATION_HEADER_INVALID')
                .withDetails('Unauthorized: Bearer token is missing.')
                .withDocsUrl('/api/v1/docs#login-an-employee');
        }
    }

    await jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            throw new UnauthorizedError('Authentication failure: invalid token.')
                .withDetails(error)
                .withDocsUrl('/api/v1/docs#login-an-employee')
                .withCode('INVALID_TOKEN');
        }

        req.auth = req.auth || {};
        await Employee.findById(decoded.id).select('-password')
            .exec()
            .then(employee => req.auth.user = employee)
            .catch(error => {
                if (error) {
                    throw new UnauthorizedError('Employee associated with this token does not exist.')
                        .withCode('EMPLOYEE_NOT_FOUND')
                        .withDetails('Please log in again.')
                        .withDocsUrl('/api/v1/docs#login-an-employee');
                }
            });
    }).catch(error => {
        if (authCookieValue) {
            res.clearCookie('token');
        }
        return next(error);
    });

    return next();
};

export default auth;