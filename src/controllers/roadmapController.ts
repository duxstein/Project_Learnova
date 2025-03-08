import { Request, Response } from 'express';
import OpenAI from 'openai';
import Course from '../models/Course';
import { AuthRequest } from '../types/auth';
import { RoadmapTopic } from '../types/learning';
import { asyncHandler } from '../utils/routeHandler';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const roadmapController = {
  generateRoadmap: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    try {
      const prompt = `Create a detailed learning roadmap for a course titled "${course.Title}" with the following details:
      Description: ${course["Short Intro"]}
      Skills: ${course.Skills}
      Category: ${course.Category}
      
      Format the response as a JSON array of topics, where each topic has:
      - id (string)
      - title (string)
      - description (string)
      - resources (array of {title, url, type}) where type is 'article', 'video', or 'course'
      - children (optional array of subtopics with the same structure)`;

      const completion = await openai.chat.completions.create({
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
        max_tokens: 2000
      });

      const roadmapContent = completion.choices[0]?.message?.content;
      if (!roadmapContent) {
        res.status(500).json({ message: 'Failed to generate roadmap' });
        return;
      }

      try {
        const parsedTopics = JSON.parse(roadmapContent) as RoadmapTopic[];
        const enrichedTopics = enrichTopicsWithCourseResources(parsedTopics, course);
        
        res.json({ 
          success: true,
          roadmap: enrichedTopics,
          course: {
            id: course._id,
            title: course.Title,
            category: course.Category
          }
        });
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        res.status(500).json({ message: 'Failed to parse roadmap data' });
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      res.status(500).json({ message: 'Error generating roadmap' });
    }
  })
};

function enrichTopicsWithCourseResources(topics: RoadmapTopic[], course: any): RoadmapTopic[] {
  return topics.map(topic => ({
    ...topic,
    resources: [
      ...(topic.resources || []),
      {
        title: course.Title,
        url: course.URL,
        type: 'course'
      }
    ],
    children: topic.children ? enrichTopicsWithCourseResources(topic.children, course) : undefined
  }));
}