import express, { Router, Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';
import { AuthRequest } from '../types/auth';

const router: Router = express.Router();

// Public routes
router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  authController.signup(req, res).catch(next);
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  authController.login(req, res).catch(next);
});

// Protected routes - apply authenticateUser middleware to all routes below
router.use(authenticateUser);

router.get('/me', (req: AuthRequest, res: Response, next: NextFunction) => {
  authController.getCurrentUser(req, res).catch(next);
});

router.put('/profile', (req: AuthRequest, res: Response, next: NextFunction) => {
  authController.updateProfile(req, res).catch(next);
});

router.put('/change-password', (req: AuthRequest, res: Response, next: NextFunction) => {
  authController.changePassword(req, res).catch(next);
});

export default router; 