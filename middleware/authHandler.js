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
    const token = req.cookies?.token || req.headers.authorization?.split(' ');

    if (!token) {
        console.log('No token found', token);
        throw new ForbiddenError('Authorization header is missing.')
            .withCode('AUTHORIZATION_HEADER_MISSING')
            .withDetails('Unauthorized: Authorization: Bearer <token> header is required.')
            .withDocsUrl('/api/v1/docs#login-an-employee');
    }

    if (token && token[0].toLowerCase() !== 'bearer') {
        throw new UnauthorizedError('Authorization header is invalid.')
            .withCode('AUTHORIZATION_HEADER_INVALID')
            .withDetails('Ensure that header value is in the format: Bearer <token>')
            .withDocsUrl('/api/v1/docs#login-an-employee');
    }

    if (token && !token[1]) {
        throw new UnauthorizedError('Authentication: bearer token is missing.')
            .withCode('AUTHORIZATION_HEADER_INVALID')
            .withDetails('Please ensure that you have a token after the Bearer keyword.')
            .withDocsUrl('/api/v1/docs#login-an-employee');
    }

    await jwt.verify(token[1], process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            throw new UnauthorizedError('Authentication failure: invalid token.')
                .withDetails(error)
                .withDocsUrl('/api/v1/docs#login-an-employee')
                .withCode('INVALID_TOKEN');
        }

        console.log(decoded);

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
        res.clearCookie('token');
        return next(error);
    });

    return next();
};

export default auth;