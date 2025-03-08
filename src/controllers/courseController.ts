import { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../types/auth';
import { Course as CourseType, transformCourseData } from '../types/course';

export const courseController = {
  getCourses: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courses = await Course.find()
        .sort({ createdAt: -1 })
        .limit(10);

      const transformedCourses = courses.map(course => {
        const baseCourse = transformCourseData(course.toObject() as CourseType);
        return {
          ...baseCourse,
          description: baseCourse["Short Intro"],
          instructor: {
            id: '1',
            name: baseCourse.instructors[0] || 'Unknown Instructor',
            avatar: `https://source.unsplash.com/random/100x100?person`
          },
          enrolledCount: baseCourse.viewersCount
        };
      });

      res.json({ success: true, courses: transformedCourses });
    } catch (error) {
      next(error);
    }
  },

  getCourseById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      const transformedCourse = transformCourseData(course.toObject() as CourseType);
      res.json({ success: true, course: transformedCourse });
    } catch (error) {
      next(error);
    }
  },

  createCourse: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseData = req.body;
      const course = new Course(courseData);
      await course.save();
      
      const transformedCourse = transformCourseData(course.toObject() as CourseType);
      res.status(201).json({ success: true, course: transformedCourse });
    } catch (error) {
      next(error);
    }
  },

  updateCourse: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      Object.assign(course, req.body);
      await course.save();
      
      const transformedCourse = transformCourseData(course.toObject() as CourseType);
      res.json({ success: true, course: transformedCourse });
    } catch (error) {
      next(error);
    }
  },

  deleteCourse: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      await course.deleteOne();
      res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};