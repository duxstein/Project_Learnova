import { Router } from 'express';
import { courseController } from '../controllers/courseController';
import { authenticateToken } from '../middleware/auth';
import { asyncMiddleware, authMiddleware } from '../middleware/routeMiddleware';

const router = Router();

// Public routes
router.get('/', asyncMiddleware(courseController.getCourses));
router.get('/:id', asyncMiddleware(courseController.getCourseById));

// Protected routes - apply authentication middleware to all routes below
router.use(authenticateToken);

// Protected routes with auth middleware
router.post('/', authMiddleware(courseController.createCourse));
router.put('/:id', authMiddleware(courseController.updateCourse));
router.delete('/:id', authMiddleware(courseController.deleteCourse));

export default router;