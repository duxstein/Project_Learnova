import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { courseController } from '../controllers/courseController';
import { authenticateToken } from '../middleware/auth';

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

// Public routes
router.get('/', wrapAsync(courseController.getCourses));
router.get('/:id', wrapAsync(courseController.getCourseById));

// Protected routes
router.use(authenticateToken as RequestHandler);
router.post('/', wrapAsync(courseController.createCourse));
router.put('/:id', wrapAsync(courseController.updateCourse));
router.delete('/:id', wrapAsync(courseController.deleteCourse));

export default router; 