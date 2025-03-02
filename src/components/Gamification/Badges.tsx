import React from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { motion } from 'framer-motion';

const Badges: React.FC = () => {
  const { badges } = useGamification();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Badges</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <motion.div
            key={badge._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg ${
              badge.earned ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'
            } border`}
          >
            {badge.imageUrl && (
              <div className="w-12 h-12 mb-3">
                <img src={badge.imageUrl} alt={badge.name} className="w-full h-full object-contain" />
              </div>
            )}
            <h3 className="font-semibold mb-2">{badge.name}</h3>
            <p className="text-sm text-gray-600">{badge.description}</p>
            <span className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
              badge.earned ? 'bg-primary-100 text-primary-800' : 'bg-gray-200 text-gray-700'
            }`}>
              {badge.earned ? 'Earned' : `${badge.requirement} points needed`}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Badges;