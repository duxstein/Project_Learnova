export interface Course {
  _id: string;
  Title: string;
  URL: string;
  "Short Intro": string;
  Category: string;
  "Sub-Category": string;
  "Course Type": string;
  Language: string;
  "Subtitle Languages": string;
  Skills: string;
  Instructors: string;
  Rating: string;
  "Number of viewers": string;
  Duration: string;
  Site: string;
}

export interface CourseDetail extends Course {
  skills: string[];
  instructors: string[];
  ratingValue: number;
  viewersCount: number;
  thumbnail: string;
  title: string;
  level: string;
  rating: number;
  duration: string;
  modules: Array<{
    title: string;
    duration: string;
    order: number;
    lessons: Array<{
      title: string;
      duration: string;
      videoUrl?: string;
      order: number;
      resources: Array<{
        title: string;
        type: 'PDF' | 'VIDEO' | 'LINK' | 'CODE';
        url: string;
      }>;
    }>;
  }>;
}

// Helper function to transform raw course data to CourseDetail
export function transformCourseData(course: Course): CourseDetail {
  return {
    ...course,
    // Split skills string into array and trim whitespace
    skills: course.Skills.split(',').map(skill => skill.trim()).filter(Boolean),
    // Split instructors string into array and trim whitespace
    instructors: course.Instructors.split(',').map(instructor => instructor.trim()).filter(Boolean),
    // Convert rating string (e.g., "4.9stars") to number
    ratingValue: parseFloat(course.Rating.replace('stars', '')),
    // Convert viewers string (e.g., "10,438 ") to number
    viewersCount: parseInt(course["Number of viewers"].replace(/,/g, '').trim()),
    // Add missing required properties
    thumbnail: `https://source.unsplash.com/random/800x600?${course.Category.toLowerCase()}`,
    title: course.Title,
    level: course["Course Type"],
    rating: parseFloat(course.Rating.replace('stars', '')),
    duration: course.Duration,
    modules: [] // Initialize with empty array, will be populated by the backend
  };
}

export interface Instructor {
  _id?: string;
  name: string;
  avatar: string;
  bio?: string;
  expertise?: string[];
}

export interface Module {
  _id: string;
  title: string;
  duration: string;
  completed: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  duration: string;
  completed: boolean;
  content?: string;
  videoUrl?: string;
  resources?: Resource[];
}

export interface Resource {
  _id: string;
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