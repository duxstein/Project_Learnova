import express, { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import OpenAI from 'openai';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types/auth';
import { asyncHandler } from '../utils/routeHandler';
import { roadmapController } from '../controllers/roadmapController';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const getRoadmap = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const prompt = `Create a detailed learning roadmap for a course titled "${course.Title}" with the following details:
    Description: ${course["Short Intro"]}
    Skills: ${course.Skills}
    Category: ${course.Category}
    
    Format the response as a structured learning path with clear milestones and prerequisites.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a curriculum designer who creates structured learning roadmaps."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const roadmapContent = response.choices[0]?.message?.content;
    if (!roadmapContent) {
      res.status(500).json({ message: 'Failed to generate roadmap' });
      return;
    }

    res.json({ 
      success: true,
      roadmap: roadmapContent,
      course: {
        id: course._id,
        title: course.Title,
        category: course.Category
      }
    });
  } catch (error) {
    next(error);
  }
};

// Use asyncHandler to wrap the route handler
router.get('/:courseId', authenticateToken, asyncHandler(getRoadmap));
// Single route handler from controller
router.get('/:courseId', authenticateToken, roadmapController.generateRoadmap);

export default router;