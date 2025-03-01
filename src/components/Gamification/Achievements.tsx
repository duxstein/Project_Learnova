import React from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { motion } from 'framer-motion';

const Achievements: React.FC = () => {
  const { achievements, streak } = useGamification();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Current Streak:</span>
          <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {streak.current} days 🔥
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg ${
              achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            } border`}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{achievement.icon}</span>
              <h3 className="font-semibold">{achievement.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
            <span className={`text-xs inline-block px-2 py-1 rounded-full ${
              achievement.earned ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
            }`}>
              {achievement.earned ? 'Unlocked' : 'Locked'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 