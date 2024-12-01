import { rateLimit } from 'express-rate-limit'

/**
 * Rate limiter middleware
 * Limits the number of requests from a single IP address
 * @type {Function}
 * @returns {Function}
 */
const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests from this IP, please try again after a minute',
    headers: true,
});

export default rateLimiter;