import axios from 'axios';
import { Course, CourseDetail } from '../types/course';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
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
  courses: CourseDetail[];
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
    const response = await api.get<{ success: boolean; courses: CourseDetail[] }>('/courses', { params });
    return {
      courses: response.data.courses,
      pagination: {
        total: response.data.courses.length,
        pages: 1,
        page: 1,
        limit: response.data.courses.length
      }
    };
  },

  // Get course details by ID
  async getCourseById(id: string): Promise<CourseDetail> {
    const response = await api.get<{ course: CourseDetail }>(`/courses/${id}`);
    return response.data.course;
  },

  // Enroll in a course
  async enrollCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Update lesson progress
  async updateLessonProgress(
    courseId: string,
    lessonId: string,
    completed: boolean
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      `/courses/${courseId}/lessons/${lessonId}/progress`,
      { completed }
    );
    return response.data;
  },

  // Get recommended courses
  async getRecommendedCourses(): Promise<CourseDetail[]> {
    const response = await api.get<{ courses: CourseDetail[] }>('/courses/recommended');
    return response.data.courses;
  },
};

export default courseApi; 