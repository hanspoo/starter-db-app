import winston from "winston";

const logConfiguration = {
  transports: [
    new winston.transports.Console({
      level: process.env["DEBUG"] || "warn",
    }),
    new winston.transports.File({
      level: "error",
      // Create the log directory if it does not exist
      filename: "logs/errors.log",
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);
export { logger };
