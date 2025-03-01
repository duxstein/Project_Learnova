import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  BookOpen, 
  Clock, 
  Award, 
  BarChart2, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Bell,
  Bookmark,
  TrendingUp,
  MoreHorizontal,
  Play,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardPageProps {
  children: ReactNode;
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
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  courses: Course[];
  message?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<ApiResponse>('/api/courses');
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          setError(response.data.message || 'Failed to fetch courses');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to LearnSmart AI</h1>
            <p className="text-gray-600 mb-8">Please log in or sign up to access your personalized dashboard.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="btn btn-primary flex items-center justify-center space-x-2 py-2 px-6"
              >
                <LogIn className="h-5 w-5" />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                className="btn btn-outline flex items-center justify-center space-x-2 py-2 px-6"
              >
                <UserPlus className="h-5 w-5" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  if (error) {
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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const inProgressCourses = courses.slice(0, 2);
  const recommendedCourses = courses.slice(2, 5);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Live Q&A: Machine Learning Career Paths',
      date: 'Tomorrow, 3:00 PM',
      type: 'Webinar'
    },
    {
      id: 2,
      title: 'Group Study: JavaScript Algorithms',
      date: 'Friday, 5:30 PM',
      type: 'Study Group'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Completed 5 lessons in one day',
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      date: '2 days ago'
    },
    {
      id: 2,
      title: 'Consistency Champion',
      description: '7-day learning streak',
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      date: 'Yesterday'
    }
  ];

  return (
    <div className="pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {children}
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Alex!</h1>
              <p className="text-gray-600">Continue your learning journey where you left off.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="relative btn btn-outline py-1.5 px-3">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
              </button>
              <button className="btn btn-primary py-1.5">
                Resume Learning
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'courses'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'achievements'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Progress */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Continue Learning</h2>
                <Link to="/course/all" className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
                  View All Courses
                </Link>
              </div>

              <div className="space-y-6">
                {inProgressCourses.map((course) => (
                  <div key={course._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{course.level}</span>
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-sm font-medium text-primary-600">{course.rating}% complete</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${course.rating}%` }}
                          ></div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center text-sm text-gray-600 mb-3 md:mb-0">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>Next: {course.modules[0].lessons[0].title}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{course.duration}</span>
                          </div>
                          <Link 
                            to={`/course/${course._id}`} 
                            className="btn btn-primary py-1.5 flex items-center justify-center"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recommended For You</h2>
                <span className="text-sm text-gray-500">Based on your interests</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedCourses.map((course) => (
                  <div key={course._id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">{course.level}</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          {course.rating}% Match
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold mb-3">{course.title}</h3>
                      <Link 
                        to={`/course/${course._id}`} 
                        className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors flex items-center"
                      >
                        View Course
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Learning Stats */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Learning Stats</h2>
                <select className="text-sm border-gray-300 rounded-md">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last 3 Months</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Hours Learned</span>
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold">12.5</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3 from last week
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Courses</span>
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-gray-500">2 in progress</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Lessons</span>
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5 from last week
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Streak</span>
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold">7 days</p>
                  <p className="text-xs text-gray-500">Keep it up!</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-gray-500">Learning activity chart will be displayed here</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Learning Path Progress */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Your Learning Path</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Data Science Specialist</span>
                  <span className="text-sm font-medium text-primary-600">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You're making great progress! Complete the Machine Learning course to advance further.
              </p>
              <Link 
                to="/path/data-science" 
                className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors flex items-center"
              >
                View Full Path
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Link 
                  to="/events" 
                  className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded mb-2">
                          {event.type}
                        </span>
                        <h3 className="font-medium text-sm mb-1">{event.title}</h3>
                        <p className="text-gray-500 text-xs flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Achievements</h2>
                <Link 
                  to="/achievements" 
                  className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-white p-2 rounded-lg mr-3">
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">{achievement.title}</h3>
                        <p className="text-gray-600 text-xs mb-1">{achievement.description}</p>
                        <p className="text-gray-500 text-xs">{achievement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Saved Resources */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Saved Resources</h2>
                <Link 
                  to="/resources" 
                  className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bookmark className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">Introduction to Neural Networks</h3>
                    <p className="text-xs text-gray-500">Article • 10 min read</p>
                  </div>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bookmark className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">JavaScript ES6 Cheat Sheet</h3>
                    <p className="text-xs text-gray-500">PDF • Reference</p>
                  </div>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bookmark className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">UX Research Methods Comparison</h3>
                    <p className="text-xs text-gray-500">Video • 15 min</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;