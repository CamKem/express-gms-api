import {NodeClient} from "@sentry/node";
/**
 * Utility for handling logging in the application, where the logs are written based on the environment.
 * @param {string} message - The message to be logged
 * @param {string} level - The level of the log
 * @param {object} metadata - Additional information to be logged
 * @returns {void}
 */

const logger = (message, level = 'info', metadata = {}) => {
    if (process.env.APP_ENV === 'production') {
        // TODO: correctly implement Sentry, using the Node SDK
        const sentry = new NodeClient(undefined);
        sentry.captureMessage(message);
        sentry.setTags({level});
        sentry.setExtra('metadata', metadata);
        sentry.setContext('request', {
            id: metadata.requestId
        });
        if (metadata.userId) sentry.setUser({id: metadata.userId});
    } else {
        console.log(`[${level.toUpperCase()}] ${message}`, metadata);
    }
}

export default logger;