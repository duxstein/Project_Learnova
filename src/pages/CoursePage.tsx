import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
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
  MessageCircle
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

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('Fetching course with ID:', courseId);
        const response = await axios.get<{ success: boolean; course: Course; message?: string }>(`/api/courses/${courseId}`);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setCourse(response.data.course);
        } else {
          setError(response.data.message || 'Failed to fetch course details');
        }
      } catch (err: any) {
        console.error('Detailed error:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch course details';
        setError(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError('No course ID provided');
      setLoading(false);
    }
  }, [courseId]);

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const startLesson = (moduleIndex: number, lessonIndex: number) => {
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(lessonIndex);
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

  const currentModule = course.modules[activeModuleIndex];
  const currentLesson = currentModule.lessons[activeLessonIndex];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
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
                  <span className="text-sm text-gray-600">{course.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{course.enrolledCount} enrolled</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium">{course.instructor.name}</p>
                </div>
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
          {/* Modules List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border rounded-lg">
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                      onClick={() => toggleModule(moduleIndex)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{module.title}</span>
                        <span className="ml-2 text-sm text-gray-500">({module.duration})</span>
                      </div>
                      {expandedModules.includes(moduleIndex) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedModules.includes(moduleIndex) && (
                      <div className="border-t">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lessonIndex}
                            className={`w-full flex items-center p-3 hover:bg-gray-50 ${
                              activeModuleIndex === moduleIndex && activeLessonIndex === lessonIndex
                                ? 'bg-primary-50 text-primary-600'
                                : ''
                            }`}
                            onClick={() => startLesson(moduleIndex, lessonIndex)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            <div className="flex-grow text-left">
                              <p className="text-sm font-medium">{lesson.title}</p>
                              <p className="text-xs text-gray-500">{lesson.duration}</p>
                            </div>
                            {moduleIndex < activeModuleIndex || (moduleIndex === activeModuleIndex && lessonIndex <= activeLessonIndex) ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player and Resources */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                  {currentLesson.videoUrl ? (
                    <video
                      src={currentLesson.videoUrl}
                      controls
                      className="w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="text-white">Video not available</div>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">{currentLesson.title}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{currentLesson.duration}</span>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Lesson Resources</h2>
              <div className="space-y-4">
                {currentLesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {resource.type === 'PDF' && <FileText className="h-5 w-5 text-red-500 mr-3" />}
                    {resource.type === 'VIDEO' && <Video className="h-5 w-5 text-blue-500 mr-3" />}
                    {resource.type === 'LINK' && <LinkIcon className="h-5 w-5 text-green-500 mr-3" />}
                    {resource.type === 'CODE' && <Code className="h-5 w-5 text-purple-500 mr-3" />}
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-gray-500">{resource.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Discussion */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Discussion</h2>
                <button className="btn btn-primary py-1.5 px-4">
                  Ask a Question
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium mr-2">John Doe</h3>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      Great explanation! Could you clarify how this concept applies to real-world scenarios?
                    </p>
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;