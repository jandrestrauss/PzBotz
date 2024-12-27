import winston from 'winston';
import 'winston-daily-rotate-file';

export interface Logger {
    logEvent(message: string): void;
    error(message: string): void;
    info(message: string): void;
}

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/pzbotz-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d'
    })
  ]
});

export const logEvent = (message: string): void => {
    winstonLogger.info(message);
};

export const error = (message: string): void => {
    winstonLogger.error(message);
};

export const info = (message: string): void => {
    winstonLogger.info(message);
};

export const logger = winstonLogger;
