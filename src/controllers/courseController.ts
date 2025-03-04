import { Request, Response, RequestHandler } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../types/auth';
import { Course as CourseType, transformCourseData } from '../types/course';

export const courseController = {
  // Get all courses
  getCourses: (async (req: Request, res: Response) => {
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

      const transformedCourse = transformCourseData(course.toObject() as CourseType);
      res.json({ success: true, course: transformedCourse });
    } catch (error) {
      console.error('Error getting course:', error);
      res.status(500).json({ success: false, message: 'Error fetching course' });
    }
  }) as RequestHandler,

  // Create new course
  createCourse: (async (req: Request, res: Response) => {
    try {
      const { Title, URL, "Short Intro": ShortIntro, Category, "Sub-Category": SubCategory,
        "Course Type": CourseType, Language, "Subtitle Languages": SubtitleLanguages,
        Skills, Instructors, Rating, "Number of viewers": NumberOfViewers,
        Duration, Site } = req.body;

      const course = new Course({
        Title,
        URL,
        "Short Intro": ShortIntro,
        Category,
        "Sub-Category": SubCategory,
        "Course Type": CourseType,
        Language,
        "Subtitle Languages": SubtitleLanguages,
        Skills,
        Instructors,
        Rating,
        "Number of viewers": NumberOfViewers,
        Duration,
        Site
      });

      await course.save();
      const transformedCourse = transformCourseData(course.toObject() as CourseType);
      res.status(201).json({ success: true, course: transformedCourse });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ success: false, message: 'Error creating course' });
    }
  }) as RequestHandler,

  // Update course
  updateCourse: (async (req: Request, res: Response) => {
    try {
      const { Title, URL, "Short Intro": ShortIntro, Category, "Sub-Category": SubCategory,
        "Course Type": CourseType, Language, "Subtitle Languages": SubtitleLanguages,
        Skills, Instructors, Rating, "Number of viewers": NumberOfViewers,
        Duration, Site } = req.body;

      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      // Update fields if provided
      if (Title) course.Title = Title;
      if (URL) course.URL = URL;
      if (ShortIntro) course["Short Intro"] = ShortIntro;
      if (Category) course.Category = Category;
      if (SubCategory) course["Sub-Category"] = SubCategory;
      if (CourseType) course["Course Type"] = CourseType;
      if (Language) course.Language = Language;
      if (SubtitleLanguages) course["Subtitle Languages"] = SubtitleLanguages;
      if (Skills) course.Skills = Skills;
      if (Instructors) course.Instructors = Instructors;
      if (Rating) course.Rating = Rating;
      if (NumberOfViewers) course["Number of viewers"] = NumberOfViewers;
      if (Duration) course.Duration = Duration;
      if (Site) course.Site = Site;

      await course.save();
      const transformedCourse = transformCourseData(course.toObject() as CourseType);
      res.json({ success: true, course: transformedCourse });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ success: false, message: 'Error updating course' });
    }
  }) as RequestHandler,

  // Delete course
  deleteCourse: (async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
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