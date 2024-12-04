import {NodeClient} from "@sentry/node";
import fs from "fs";
/**
 * Utility for handling logging in the application, where the logs are written based on the environment.
 * @param {null} message - The message to be logged
 * @param {string} level - The level of the log
 * @param {object} metadata - Additional information to be logged
 * @returns {void}
 */

const logger = (message= null, level = 'info', metadata = {}) => {
    if (process.env.APP_ENV === 'production') {
        if (process.env.SENTRY_DSN === undefined || process.env.LOG_LEVEL === 'file') {
            fileSystemLogger(message, level, metadata);
        } else if (process.env.LOG_LEVEL === 'sentry' && process.env.SENTRY_DSN) {
            sentryLogger(message, level, metadata);
        } else {
            consoleLogger(message, level, metadata);
        }
    } else {
        if (process.env.LOG_LEVEL === 'file') {
            fileSystemLogger(message, level, metadata);
        } else {
            consoleLogger(message, level, metadata);
        }
    }
}

const consoleLogger = (message, level, metadata) => {
    console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n${metadata}`);
}

const sentryLogger = (message, level, metadata) => {
    const sentry = new NodeClient({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
    });

    sentry.captureMessage(message, level, metadata);
}

const fileSystemLogger = (message, level, metadata) => {
    const fileName = `logs/${level}.log`;
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n${metadata}\n`;
    fs.appendFile(fileName, logMessage, (err) => {
        if (err) {
            console.log(`Error writing to log file: ${err}`);
        }
    });
}

export default logger;