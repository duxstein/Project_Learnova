import axios from 'axios';
import OpenAI from 'openai';
import { RoadmapTopic, UserLearningProfile, LearningRoadmap } from '../types/learning';
import Course, { ICourse } from '../models/Course';
import { LearningRoadmap } from '../types/learning';

export class RoadmapService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
  }

  private readonly API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  async getRoadmapForCourse(courseId: string, userId: string): Promise<LearningRoadmap> {
    try {
      const response = await fetch(`${this.API_URL}/roadmap/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmap');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      throw error;
    }
  }
}