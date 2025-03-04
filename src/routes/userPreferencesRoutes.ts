import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { userPreferencesController } from '../controllers/userPreferencesController';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types/auth';

const router = Router();

// Helper to wrap async handlers
const wrapAsync = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// All routes require authentication
router.use(authenticateToken as RequestHandler);

// Submit or update user preferences
router.post('/', wrapAsync(userPreferencesController.submitPreferences as RequestHandler));

// Get user's current preferences and recommendations
router.get('/', wrapAsync(userPreferencesController.getPreferences as RequestHandler));

// Get AI-powered course recommendations
router.get('/recommendations', wrapAsync(userPreferencesController.getRecommendations as RequestHandler));

export default router; 