import axios from 'axios';
import { Course, CourseDetail } from '../types/course';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface CourseQueryParams {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
  limit?: number;
}

interface CourseResponse {
  courses: Course[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export const courseApi = {
  // Get all courses with filtering and pagination
  async getCourses(params: CourseQueryParams = {}): Promise<CourseResponse> {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  // Get course details by ID
  async getCourseById(id: string): Promise<CourseDetail> {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Enroll in a course
  async enrollCourse(courseId: string): Promise<any> {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Update lesson progress
  async updateLessonProgress(
    courseId: string,
    lessonId: string,
    completed: boolean
  ): Promise<any> {
    const response = await api.post(
      `/courses/${courseId}/lessons/${lessonId}/progress`,
      { completed }
    );
    return response.data;
  },

  // Get recommended courses
  async getRecommendedCourses(): Promise<Course[]> {
    const response = await api.get('/courses/recommended');
    return response.data;
  },
};

export default courseApi; 