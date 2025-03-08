import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from '../types/auth';

export const asyncMiddleware = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const authMiddleware = (
  handler: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};