export interface UserPreferences {
  learningStyle: string;
  learningPace: string;
  learningApproach: string;
  preferredTime: string;
  sessionDuration: string;
  learningEnvironment: string;
  learningStrength: string;
}

export interface AIRecommendation {
  courseId: string;
  explanation: string;
  course?: any; // Will be populated with course details
}

export interface LearningPathStep {
  order: number;
  courseId: string;
  explanation: string;
  course?: any; // Will be populated with course details
}

export interface LearningPath {
  name: string;
  description: string;
  steps: LearningPathStep[];
}

export interface RecommendationResponse {
  recommendations: AIRecommendation[];
  learningPath: LearningPath;
} 