import express, { RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getUserData,
  getLeaderboard,
  updateStreak,
  addPoints,
  unlockBadge
} from '../controllers/gamificationController';
import { wrapAuthHandler } from '../utils/routeHandler';

const router = express.Router();

// Protected routes - require authentication
router.get('/user-data', authenticateToken, wrapAuthHandler(getUserData));
router.post('/update-streak', authenticateToken, wrapAuthHandler(updateStreak));
router.post('/add-points', authenticateToken, wrapAuthHandler(addPoints));
router.post('/unlock-badge', authenticateToken, wrapAuthHandler(unlockBadge));

// Public routes
router.get('/leaderboard', wrapAuthHandler(getLeaderboard));

export default router;