import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Error:', err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    }
  });
}
