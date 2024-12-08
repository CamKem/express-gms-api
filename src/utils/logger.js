import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

/**
 * Utility for handling logging in the application, where the logs are written based on the environment.
 * @param {null} message - The message to be logged
 * @param {string} level - The level of the log
 * @param {object} metadata - Additional information to be logged
 * @returns {void}
 */
const logger = (message = null, level = 'info', metadata = {}) => {
    if (message) {
        if (process.env.LOG_LEVEL === 'file') {
            fileSystemLogger(message, level, metadata);
        }
        // console log all by default even if the log level is not set
        consoleLogger(message, level, metadata);
    }
}

const consoleLogger = (message, level, metadata) => {
    // if meta data is an empty object, log it as an empty string
    if (Object.keys(metadata).length === 0) {
        console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`);
    } else {
        metadata = JSON.stringify(metadata, null, 2);
        console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n${metadata}`);
    }
}

const fileSystemLogger = (message, level, metadata) => {
    const dir = './logs';
    const fileName = `${dir}/${level}.log`;
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n${metadata}\n`;

    // check if the directory exists, if not create it
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }

    const lookForOrCreateFile = () => {
        // check the file exists if not create it
        if (!fs.existsSync(fileName)) {
            console.log('Creating log file');
            fs.writeFileSync(fileName, '');
        }
        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`Error creating log file: ${err}`);
            }
        });

    }

    lookForOrCreateFile();

    if (fs.statSync(fileName).size > 1000000) {
        fs.rename(fileName, `./logs/${level}-old.log`, (err) => {
            if (err) {
                console.log(`Error renaming log file: ${err}`);
            }
        });
        lookForOrCreateFile();
    }

    fs.appendFile(fileName, logMessage, (err) => {
        if (err) {
            console.log(`Error writing to log file: ${err}`);
        }
    });
}

export default logger;