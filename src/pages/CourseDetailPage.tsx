import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';

// Temporary mock data - will be replaced with backend data
const mockCourseDetail = {
  id: '1',
  title: 'Introduction to Web Development',
  description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from a beginner to being able to create your own responsive websites.',
  duration: '8 weeks',
  level: 'Beginner',
  progress: 75,
  thumbnail: 'https://source.unsplash.com/random/1200x600?web',
  instructor: {
    name: 'John Doe',
    avatar: 'https://source.unsplash.com/random/100x100?person',
    bio: 'Senior Web Developer with 10+ years of experience in full-stack development.',
  },
  curriculum: [
    {
      id: '1',
      title: 'Module 1: HTML Fundamentals',
      duration: '2 hours',
      completed: true,
      lessons: [
        { id: '1.1', title: 'Introduction to HTML', duration: '30 min', completed: true },
        { id: '1.2', title: 'HTML Elements & Tags', duration: '45 min', completed: true },
        { id: '1.3', title: 'Forms & Input Elements', duration: '45 min', completed: true },
      ],
    },
    {
      id: '2',
      title: 'Module 2: CSS Styling',
      duration: '2.5 hours',
      completed: false,
      lessons: [
        { id: '2.1', title: 'CSS Selectors', duration: '45 min', completed: true },
        { id: '2.2', title: 'Box Model & Layout', duration: '45 min', completed: false },
        { id: '2.3', title: 'Flexbox & Grid', duration: '60 min', completed: false },
      ],
    },
  ],
};

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addPoints } = useGamification();
  const [activeModule, setActiveModule] = useState<string>(mockCourseDetail.curriculum[0].id);

  const handleLessonComplete = (lessonId: string) => {
    // In the real implementation, this would update the backend
    addPoints(10, 'Completed lesson');
    // You could also check for achievements here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Overview */}
        <div className="lg:col-span-2">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={mockCourseDetail.thumbnail}
            alt={mockCourseDetail.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{mockCourseDetail.title}</h1>
          <div className="flex items-center mb-6">
            <img
              src={mockCourseDetail.instructor.avatar}
              alt={mockCourseDetail.instructor.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-medium text-gray-900">{mockCourseDetail.instructor.name}</h3>
              <p className="text-sm text-gray-600">{mockCourseDetail.instructor.bio}</p>
            </div>
          </div>
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">About this course</h2>
            <p className="text-gray-700">{mockCourseDetail.description}</p>
          </div>
        </div>

        {/* Course Progress and Curriculum */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mockCourseDetail.progress}%` }}
                  className="h-full bg-primary-500 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{mockCourseDetail.progress}% Complete</p>
            </div>

            <div className="space-y-4">
              {mockCourseDetail.curriculum.map(module => (
                <div key={module.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveModule(module.id)}
                    className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                  >
                    <span className="font-medium">{module.title}</span>
                    <span className="text-sm text-gray-500">{module.duration}</span>
                  </button>
                  {activeModule === module.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t"
                    >
                      {module.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="px-4 py-2 flex justify-between items-center hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={lesson.completed}
                              onChange={() => handleLessonComplete(lesson.id)}
                              className="mr-3"
                            />
                            <span className={lesson.completed ? 'text-gray-500 line-through' : ''}>
                              {lesson.title}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage; 