import { Schema } from 'mongoose';

export interface RoadmapTopic {
  id: string;
  title: string;
  description?: string;
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'course';
  }[];
  children?: RoadmapTopic[];
}

export interface UserLearningProfile {
  currentSkills: string[];
  desiredPath: string; // Maps to Course.Category
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningRoadmap {
  userId: Schema.Types.ObjectId;
  path: string;
  topics: RoadmapTopic[];
  progress: {
    completedTopics: string[]; // topic IDs
    currentTopic: string; // topic ID
  };
  createdAt: Date;
  updatedAt: Date;
} 