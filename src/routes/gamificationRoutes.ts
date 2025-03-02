import express, { RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getUserData,
  getLeaderboard,
  updateStreak,
  addPoints,
  unlockBadge
} from '../controllers/gamificationController';

const router = express.Router();

// Helper to wrap async handlers
const wrapHandler = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Protected routes - require authentication
router.get('/user-data', authenticateToken as RequestHandler, wrapHandler(getUserData as RequestHandler));
router.post('/update-streak', authenticateToken as RequestHandler, wrapHandler(updateStreak as RequestHandler));
router.post('/add-points', authenticateToken as RequestHandler, wrapHandler(addPoints as RequestHandler));
router.post('/unlock-badge', authenticateToken as RequestHandler, wrapHandler(unlockBadge as RequestHandler));

// Public routes - no authentication required
router.get('/leaderboard', wrapHandler(getLeaderboard as RequestHandler));

export default router; 