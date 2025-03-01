import React from 'react';
import { useGamification } from '../../contexts/GamificationContext';

const ProgressBar: React.FC = () => {
  const { progress, level, points } = useGamification();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Level {level}</h2>
        <span className="text-primary-600 font-semibold">{points} total points</span>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
              Level Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-primary-600">
              {progress.current}/{progress.nextLevel}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
          <div
            style={{ width: `${progress.percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;