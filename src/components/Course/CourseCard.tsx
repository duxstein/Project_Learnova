import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import { Course } from '../../types/course';

interface CourseCardProps extends Course {}

const CourseCard: React.FC<CourseCardProps> = (course) => {
  // Extract first instructor name
  const primaryInstructor = course.Instructors.split(',')[0].trim();

  // Get first three skills
  const topSkills = course.Skills.split(',')
    .map(skill => skill.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {course["Course Type"]}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">{course.Rating.replace('stars', '')}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{course.Title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course["Short Intro"]}</p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {topSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.Duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{course["Number of viewers"]} students</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">{primaryInstructor}</span>
          </div>
          <Link
            to={course.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary py-1.5 px-4"
          >
            View Course
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard; 