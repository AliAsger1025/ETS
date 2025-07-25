const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const systemLogger = createLogger({
    transports: [
        new transports.Console({
            level: "info",
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `level : ${info.level}:${[info.timestamp]} : ${info.message}`),
            ),
        }),
        new transports.Console({
            level: "error",
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `level : ${error.level}:${[error.timestamp]} : ${error.message}`),
            ),
        }),
        new transports.File({
            filename: "logs/systemLog_info.log",
            level: "info",
            maxsize: 5242880,
            maxFiles: 5,
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `level : ${info.level}:${[info.timestamp]} : ${info.message}`),
            ),
        }),
        new transports.File({
            filename: "logs/systemLog_info.log",
            level: "error",
            maxsize: 5242880,
            maxFiles: 5,
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `level : ${error.level}:${[error.timestamp]} : ${error.message}`),
            ),
        }),
        new transports.MongoDB({
            level: "info",
            db: process.env.URL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'logData',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `level : ${info.level}:${[info.timestamp]} : ${info.message}`),
            ),
        }),
        new transports.MongoDB({
            level: "error",
            db: process.env.URL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'logData',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `level : ${error.level}:${[error.timestamp]} : ${error.message}`),
            )
        })
    ],
})

module.exports = systemLogger;
