import React, { useState } from 'react';

const PointsSystem: React.FC = () => {
  const [points, setPoints] = useState<number>(0);

  const handleAddPoints = (amount: number) => {
    setPoints(prevPoints => prevPoints + amount);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Points System</h2>
      <div className="flex items-center space-x-4">
        <div className="text-lg">
          Your points: <span className="font-bold text-blue-600">{points}</span>
        </div>
        <button
          onClick={() => handleAddPoints(10)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Earn 10 Points
        </button>
      </div>
    </div>
  );
};

export default PointsSystem;