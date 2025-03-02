import { Request, Response, RequestHandler } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../types/auth';

export const courseController = {
  // Get all courses
  getCourses: (async (req: Request, res: Response) => {
    try {
      const courses = await Course.find()
        .sort({ createdAt: -1 })
        .limit(10);

      res.json({ success: true, courses });
    } catch (error) {
      console.error('Error getting courses:', error);
      res.status(500).json({ success: false, message: 'Error fetching courses' });
    }
  }) as RequestHandler,

  // Get course by ID
  getCourseById: (async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      res.json({ success: true, course });
    } catch (error) {
      console.error('Error getting course:', error);
      res.status(500).json({ success: false, message: 'Error fetching course' });
    }
  }) as RequestHandler,

  // Create new course
  createCourse: (async (req: Request, res: Response) => {
    try {
      const { title, description, thumbnail, duration, level } = req.body;
      const authReq = req as AuthRequest;

      if (!authReq.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const course = new Course({
        title,
        description,
        thumbnail,
        duration,
        level,
        instructor: {
          id: authReq.user.id,
          name: authReq.user.name,
          avatar: authReq.user.avatar,
        },
      });

      await course.save();
      res.status(201).json({ success: true, course });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ success: false, message: 'Error creating course' });
    }
  }) as RequestHandler,

  // Update course
  updateCourse: (async (req: Request, res: Response) => {
    try {
      const { title, description, thumbnail, duration, level } = req.body;
      const authReq = req as AuthRequest;
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      if (!authReq.user || course.instructor.id.toString() !== authReq.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
      }

      course.title = title || course.title;
      course.description = description || course.description;
      course.thumbnail = thumbnail || course.thumbnail;
      course.duration = duration || course.duration;
      course.level = level || course.level;

      await course.save();
      res.json({ success: true, course });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ success: false, message: 'Error updating course' });
    }
  }) as RequestHandler,

  // Delete course
  deleteCourse: (async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      if (!authReq.user || course.instructor.id.toString() !== authReq.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
      }

      await course.deleteOne();
      res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ success: false, message: 'Error deleting course' });
    }
  }) as RequestHandler,
};

export default courseController; 