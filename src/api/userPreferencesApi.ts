import axios from 'axios';
import { CourseDetail } from '../types/course';
import { UserPreferences } from '../types/userPreferences';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface AIRecommendationResponse {
  recommendations: CourseDetail[];
  explanation: string;
  suggestedPath: {
    name: string;
    description: string;
    steps: {
      order: number;
      courseId: string;
      title: string;
      description: string;
    }[];
  };
}

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const userPreferencesApi = {
  submitPreferences: async (preferences: Record<number, string>): Promise<AIRecommendationResponse> => {
    try {
      // Transform numbered answers into structured preferences
      const userPreferences: UserPreferences = {
        learningStyle: preferences[1],
        learningPace: preferences[2],
        learningApproach: preferences[3],
        preferredTime: preferences[4],
        sessionDuration: preferences[5],
        learningEnvironment: preferences[6],
        learningStrength: preferences[7]
      };

      console.log('Submitting preferences:', userPreferences); // Debug log

      const response = await api.post('/user-preferences', userPreferences);
      return response.data;
    } catch (error) {
      console.error('Error submitting preferences:', error);
      throw error;
    }
  },

  getRecommendations: async (): Promise<AIRecommendationResponse> => {
    try {
      const response = await api.get('/user-preferences/recommendations');
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<AIRecommendationResponse> => {
    try {
      const response = await api.patch('/user-preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },
};

export default userPreferencesApi; 