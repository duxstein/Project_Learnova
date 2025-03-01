import { Router, Request, Response } from 'express';
import { courseController } from '../controllers/courseController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes
router.use(authenticateUser);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

export default router; 