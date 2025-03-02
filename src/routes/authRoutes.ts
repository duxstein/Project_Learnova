import express, { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types/auth';

const router: Router = express.Router();

// Helper to handle async route handlers
const asyncHandler = (fn: Function): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};

// Public routes
router.post('/signup', asyncHandler((req: Request, res: Response) => authController.signup(req, res)));
router.post('/login', asyncHandler((req: Request, res: Response) => authController.login(req, res)));

// Protected routes - apply authenticateToken middleware to all routes below
router.use(authenticateToken as RequestHandler);

// Protected route handlers
router.get('/me', asyncHandler((req: Request, res: Response) => authController.getCurrentUser(req as AuthRequest, res)));
router.put('/profile', asyncHandler((req: Request, res: Response) => authController.updateProfile(req as AuthRequest, res)));
router.put('/change-password', asyncHandler((req: Request, res: Response) => authController.changePassword(req as AuthRequest, res)));

export default router; 