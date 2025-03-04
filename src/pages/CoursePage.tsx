import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import courseApi from '../api/courseApi';
import { CourseDetail } from '../types/course';
import { youtubeService } from '../services/youtubeService';
import YouTubePlayer from '../components/YouTubePlayer';
import {
  BookOpen,
  Clock,
  Award,
  Play,
  CheckCircle,
  Lock,
  FileText,
  Video,
  Link as LinkIcon,
  Code,
  ChevronRight,
  ChevronDown,
  Star,
  Users,
  MessageCircle,
  Loader
} from 'lucide-react';

interface Resource {
  title: string;
  type: 'PDF' | 'VIDEO' | 'LINK' | 'CODE';
  url: string;
}

interface Lesson {
  title: string;
  duration: string;
  videoUrl?: string;
  order: number;
  resources: Resource[];
}

interface Module {
  title: string;
  duration: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledCount: number;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

interface LearningRoadmap {
  playlistId: string;
  playlistTitle: string;
  channelTitle: string;
  totalVideos: number;
  videos: {
    title: string;
    description: string;
    videoId: string;
    position: number;
    thumbnail: string;
  }[];
}

const CoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [learningRoadmap, setLearningRoadmap] = useState<LearningRoadmap | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('Fetching course with ID:', id);
        if (!id) {
          throw new Error('No course ID provided');
        }
        const courseData = await courseApi.getCourseById(id);
        setCourse(courseData);
        
        // Create learning roadmap from YouTube playlist
        if (courseData.title) {
          await loadLearningRoadmap(courseData.title);
        }
      } catch (err: any) {
        console.error('Detailed error:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch course details';
        setError(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    } else {
      setError('No course ID provided');
      setLoading(false);
    }
  }, [id]);

  const loadLearningRoadmap = async (searchQuery: string) => {
    setLoadingVideo(true);
    try {
      const roadmap = await youtubeService.createLearningRoadmap(searchQuery);
      if (roadmap && roadmap.videos && roadmap.videos.length > 0) {
        setLearningRoadmap(roadmap);
        setCurrentVideoId(roadmap.videos[0].videoId);
      } else {
        console.log('No learning roadmap available for:', searchQuery);
        setError('No video content available for this course. Please try again later.');
      }
    } catch (error) {
      console.error('Error loading learning roadmap:', error);
      setError('Failed to load video content. Please check your internet connection and try again.');
    } finally {
      setLoadingVideo(false);
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const startLesson = async (moduleIndex: number, lessonIndex: number) => {
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(lessonIndex);
    
    if (learningRoadmap?.videos[lessonIndex]) {
      setCurrentVideoId(learningRoadmap.videos[lessonIndex].videoId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary py-2 px-6"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentModule = course.modules?.[activeModuleIndex];
  const currentLesson = currentModule?.lessons?.[activeLessonIndex];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course["Short Intro"]}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-sm text-gray-600">{course.ratingValue.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{course.viewersCount} enrolled</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {course.instructors.length > 0 && (
                  <>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructors[0])}`}
                      alt={course.instructors[0]}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-medium">{course.instructors[0]}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span className="text-primary-600">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <button className="btn btn-primary w-full mb-4">
                  Continue Learning
                </button>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>4 lessons completed</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span>12 lessons remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              {loadingVideo ? (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Loader className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : currentVideoId ? (
                <YouTubePlayer
                  videoId={currentVideoId}
                  className="w-full rounded-lg overflow-hidden"
                />
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No video available</p>
                </div>
              )}
              
              {learningRoadmap && currentVideoId && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">
                    {learningRoadmap.videos.find(v => v.videoId === currentVideoId)?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    From playlist: {learningRoadmap.playlistTitle}
                  </p>
                  <p className="text-sm text-gray-500">
                    By {learningRoadmap.channelTitle}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Course Modules */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              {learningRoadmap ? (
                <div className="space-y-4">
                  {learningRoadmap.videos.map((video, index) => (
                    <button
                      key={video.videoId}
                      onClick={() => {
                        setCurrentVideoId(video.videoId);
                        setActiveLessonIndex(index);
                      }}
                      className={`w-full flex items-center p-3 hover:bg-gray-50 rounded-lg border ${
                        currentVideoId === video.videoId
                          ? 'bg-primary-50 text-primary-600 border-primary-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0 w-24 mr-4">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full rounded-md"
                        />
                      </div>
                      <div className="flex-grow text-left">
                        <h3 className="font-medium text-sm">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Lesson {index + 1}
                        </p>
                      </div>
                      {currentVideoId === video.videoId && (
                        <Play className="h-4 w-4 ml-2 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No playlist available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;