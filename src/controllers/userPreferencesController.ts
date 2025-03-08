import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import User from '../models/User';
import Course from '../models/Course';
import { UserPreferences } from '../types/userPreferences';
import { Course as CourseType, transformCourseData } from '../types/course';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Warning: OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '', // Provide empty string as fallback
});

export const userPreferencesController = {
  submitPreferences: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const preferences: UserPreferences = req.body;

      // Update user preferences and mark onboarding as completed
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            preferences,
            hasCompletedOnboarding: true,
          },
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return a basic response without AI recommendations
      res.json({
        message: 'Preferences updated successfully',
        recommendations: {
          recommendations: [],
          learningPath: {
            name: "Basic Learning Path",
            description: "A starter path for your learning journey",
            steps: []
          }
        }
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getPreferences: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        preferences: user.preferences || {},
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getRecommendations: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.preferences) {
        return res.status(400).json({
          message: 'Please complete the onboarding process to get personalized recommendations',
        });
      }

      const recommendations = await generateRecommendations(user.preferences);
      res.json(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

async function generateRecommendations(preferences: UserPreferences) {
  try {
    // Get all courses
    const courses = await Course.find();
    const transformedCourses = courses.map(course => transformCourseData(course.toObject() as CourseType));

    // Create a prompt for the AI
    const prompt = `
      Given a user with the following preferences:
      - Learning Style: ${preferences.learningStyle}
      - Learning Pace: ${preferences.learningPace}
      - Learning Approach: ${preferences.learningApproach}
      - Preferred Time: ${preferences.preferredTime}
      - Session Duration: ${preferences.sessionDuration}
      - Learning Environment: ${preferences.learningEnvironment}
      - Learning Strength: ${preferences.learningStrength}

      And the following available courses:
      ${transformedCourses.map(course => `
        - Title: ${course.Title}
        - URL: ${course.URL}
        - Category: ${course.Category}
        - Course Type: ${course["Course Type"]}
        - Duration: ${course.Duration}
        - Description: ${course["Short Intro"]}
        - Skills: ${course.skills.join(', ')}
        - Rating: ${course.ratingValue}
      `).join('\n')}

      Please recommend the top 5 most suitable courses for this user and explain why each course is recommended.
      Also suggest a learning path that combines these courses in an optimal order.
      Format the response as a JSON object with the following structure:
      {
        "recommendations": [
          {
            "courseTitle": "exact course title",
            "courseUrl": "exact course URL",
            "explanation": "why this course is recommended"
          }
        ],
        "learningPath": {
          "name": "path name",
          "description": "path description",
          "steps": [
            {
              "order": 1,
              "courseTitle": "exact course title",
              "courseUrl": "exact course URL",
              "explanation": "why this course should be taken at this step"
            }
          ]
        }
      }

      Important: Use the exact course titles and URLs as provided in the course list above.
    `;

    // Get AI recommendations
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI learning advisor that provides personalized course recommendations."
        },
        {
          role: "user",
          content: `Based on the following user preferences and learning history, suggest relevant courses and a learning path:
            Learning Style: ${preferences.learningStyle}
            Learning Pace: ${preferences.learningPace}
            Learning Approach: ${preferences.learningApproach}
            Preferred Time: ${preferences.preferredTime}
            Session Duration: ${preferences.sessionDuration}
            Learning Environment: ${preferences.learningEnvironment}
            Learning Strength: ${preferences.learningStrength}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const aiResponse = JSON.parse(content);

    // Find courses by title and URL
    const findCourseByTitleAndUrl = (title: string, url: string) => {
      return transformedCourses.find(c => 
        c.Title.toLowerCase() === title.toLowerCase() && 
        c.URL.toLowerCase() === url.toLowerCase()
      );
    };

    // Combine AI recommendations with course details
    return {
      recommendations: aiResponse.recommendations.map((rec: any) => ({
        ...rec,
        course: findCourseByTitleAndUrl(rec.courseTitle, rec.courseUrl),
      })),
      learningPath: {
        ...aiResponse.learningPath,
        steps: aiResponse.learningPath.steps.map((step: any) => ({
          ...step,
          course: findCourseByTitleAndUrl(step.courseTitle, step.courseUrl),
        })),
      },
    };
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    throw error;
  }
}