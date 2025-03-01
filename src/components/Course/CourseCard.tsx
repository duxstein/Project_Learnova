import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGamification } from '../../contexts/GamificationContext';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  duration,
  level,
  progress,
  thumbnail,
  instructor,
}) => {
  const { addPoints } = useGamification();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <Link to={`/course/${id}`} className="block">
        <div className="relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(level)}`}>
              {level}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          
          <div className="flex items-center mb-4">
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{instructor.name}</span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{duration}</span>
            <div className="flex items-center">
              <span className="mr-2">{progress}% complete</span>
              <div className="w-20 h-2 bg-gray-200 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard; 