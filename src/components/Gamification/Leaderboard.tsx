import React from 'react';
import { useGamification } from '../../contexts/GamificationContext';

const Leaderboard: React.FC = () => {
  const { leaderboard } = useGamification();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="space-y-4">
        {leaderboard.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              entry.rank === 1 ? 'bg-yellow-50 border-yellow-200' :
              entry.rank === 2 ? 'bg-gray-50 border-gray-200' :
              entry.rank === 3 ? 'bg-orange-50 border-orange-200' :
              'bg-white border-gray-100'
            } border`}
          >
            <div className="flex items-center">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                entry.rank === 2 ? 'bg-gray-100 text-gray-700' :
                entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-50 text-gray-600'
              }`}>
                {entry.rank}
              </span>
              <span className="font-medium">{entry.name}</span>
            </div>
            <span className="font-semibold text-primary-600">{entry.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;