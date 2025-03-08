import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from '../types/auth';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

type AsyncAuthRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (handler: AsyncRequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const asyncAuthHandler = (handler: AsyncAuthRequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const wrapHandler = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const wrapAuthHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};