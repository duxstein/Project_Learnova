export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: CourseLevel;
  progress: number;
  thumbnail: string;
  instructor: Instructor;
  category: CourseCategory;
}

export interface CourseDetail extends Course {
  curriculum: Module[];
}

export interface Instructor {
  id?: string;
  name: string;
  avatar: string;
  bio?: string;
  expertise?: string[];
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content?: string;
  videoUrl?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'code';
  url: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCategory = 
  | 'Web Development'
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'DevOps'
  | 'Data Science'
  | 'Machine Learning'
  | 'Cloud Computing'; 