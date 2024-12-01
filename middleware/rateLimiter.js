// Purpose: Rate limiter middleware to limit the number of requests to the server.
import { rateLimit } from 'express-rate-limit'

const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests from this IP, please try again after a minute',
    headers: true,
});

export default rateLimiter;