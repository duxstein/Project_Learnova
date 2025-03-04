import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';
import gamificationApi from '../api/gamificationApi';
import { IBadge } from '../models/Badge';
import { Types } from 'mongoose';

interface GamificationContextType {
  points: number;
  level: number;
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  achievements: Achievement[];
  addPoints: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  unlockAchievement: (achievementId: number) => void;
  progress: {
    current: number;
    nextLevel: number;
    percentage: number;
  };
  lastReward: Reward | null;
  streak: {
    current: number;
    lastLogin: string;
  };
  updateStreak: () => void;
  userName: string;
}

interface Badge {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  requirement: number;
  earned?: boolean;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  level: number;
  levelProgress: {
    current: number;
    nextLevel: number;
    percentage: number;
  };
}

interface Reward {
  type: 'points' | 'badge' | 'achievement' | 'level';
  message: string;
  timestamp: number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [lastReward, setLastReward] = useState<Reward | null>(null);
  const [streak, setStreak] = useState({ current: 0, lastLogin: new Date().toISOString() });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState({ current: 0, nextLevel: 1000, percentage: 0 });

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchLeaderboard();
    }
  }, [user]);

  // Set up auto-refresh for user data and leaderboard
  useEffect(() => {
    const refreshData = async () => {
      if (user) {
        await Promise.all([
          fetchUserData(),
          fetchLeaderboard()
        ]);
      }
    };

    const refreshInterval = setInterval(refreshData, 5000);
    return () => clearInterval(refreshInterval);
  }, [user]);

  // Check for daily login bonus on component mount
  useEffect(() => {
    if (user) {
      checkDailyLoginBonus();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const data = await gamificationApi.getUserData();
      
      console.log('User data refresh:', {
        oldPoints: points,
        newPoints: data.points,
        oldLevel: level,
        newLevel: data.level,
        levelProgress: data.levelProgress
      });

      setPoints(data.points);
      setLevel(data.level);
      setBadges(data.badges);
      setUserName(data.name || '');
      setStreak({
        current: data.currentStreak,
        lastLogin: data.lastLoginAt || new Date().toISOString()
      });
      setProgress(data.levelProgress);

      return data;
    } catch (error) {
      console.error('Error fetching user gamification data:', error);
      return null;
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await gamificationApi.getLeaderboard();
      if (response.success && Array.isArray(response.data)) {
        const formattedLeaderboard = response.data.map((entry: any) => ({
          id: entry._id || String(entry.rank),
          name: entry.name,
          points: entry.points,
          rank: entry.rank,
          level: entry.level,
          levelProgress: entry.levelProgress
        }));
        setLeaderboard(formattedLeaderboard);
      } else {
        console.error('Invalid leaderboard data structure:', response);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const checkDailyLoginBonus = async () => {
    try {
      const lastLoginStr = localStorage.getItem('lastLoginBonus');
      const now = new Date();
      const lastLogin = lastLoginStr ? new Date(lastLoginStr) : null;

      if (!lastLogin || (now.getTime() - lastLogin.getTime()) >= 24 * 60 * 60 * 1000) {
        console.log('Claiming daily login bonus...');
        await updateStreak();
        localStorage.setItem('lastLoginBonus', now.toISOString());
      }
    } catch (error) {
      console.error('Error checking daily login bonus:', error);
    }
  };

  const calculateLevel = (points: number) => {
    let levelPoints = 1000; // Base points for level 1
    let currentLevel = 1;
    let accumulatedPoints = 0;

    while (points >= accumulatedPoints + levelPoints) {
      accumulatedPoints += levelPoints;
      currentLevel++;
      levelPoints = Math.floor(levelPoints * 1.8); // Increase by 1.8x for next level
    }

    return currentLevel;
  };

  const calculateProgress = (points: number) => {
    let levelPoints = 1000; // Base points for level 1
    let accumulatedPoints = 0;
    let currentLevel = 1;

    // Find the current level and its point requirements
    while (points >= accumulatedPoints + levelPoints) {
      accumulatedPoints += levelPoints;
      currentLevel++;
      levelPoints = Math.floor(levelPoints * 1.8);
    }

    // Points in current level
    const pointsInCurrentLevel = points - accumulatedPoints;
    // Points needed for next level
    const pointsNeededForNextLevel = levelPoints;

    console.log(`Frontend progress calculation:
      Total points: ${points}
      Accumulated points: ${accumulatedPoints}
      Points in current level: ${pointsInCurrentLevel}
      Points needed for next level: ${pointsNeededForNextLevel}
      Percentage: ${(pointsInCurrentLevel / pointsNeededForNextLevel) * 100}%`);

    return {
      current: pointsInCurrentLevel,
      nextLevel: pointsNeededForNextLevel,
      percentage: (pointsInCurrentLevel / pointsNeededForNextLevel) * 100
    };
  };

  const updateStreak = async () => {
    if (!user) return;

    try {
      const data = await gamificationApi.updateStreak();
      const { points: newPoints, streak: newStreak, level: newLevel, levelProgress } = data;

      setPoints(newPoints);
      setLevel(newLevel);
      setStreak(newStreak);
      setProgress(levelProgress);

      if (newLevel > level) {
        setLastReward({
          type: 'level',
          message: `Congratulations! You've reached level ${newLevel}!`,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const addPoints = async (amount: number, reason?: string) => {
    if (!user) return;

    try {
      const data = await gamificationApi.addPoints(amount);
      const { points: newPoints, level: newLevel, levelProgress } = data;

      setPoints(newPoints);
      setLevel(newLevel);
      setProgress(levelProgress);

      setLastReward({
        type: 'points',
        message: `${reason || 'You earned'} ${amount} points!`,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const unlockBadge = async (badgeId: string) => {
    if (!user) return;

    try {
      const data = await gamificationApi.unlockBadge(badgeId);
      await fetchUserData(); // Refresh user data to get updated badges
      return data;
    } catch (error) {
      console.error('Error unlocking badge:', error);
    }
  };

  const unlockAchievement = async (achievementId: number) => {
    if (!user) return;

    try {
      const response = await gamificationApi.unlockAchievement(achievementId);
      const { achievements: newAchievements, points: newPoints } = response;
      
      setAchievements(newAchievements);
      setPoints(newPoints);
      setLastReward({
        type: 'achievement',
        message: `New Achievement: ${newAchievements.find(a => a.id === achievementId)?.name}`,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const value = {
    points,
    level,
    badges,
    leaderboard,
    achievements,
    addPoints,
    unlockBadge,
    unlockAchievement,
    progress,
    lastReward,
    streak,
    updateStreak,
    userName
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {lastReward && Date.now() - lastReward.timestamp < 3000 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              lastReward.type === 'level' ? 'bg-purple-500 text-white' :
              lastReward.type === 'badge' ? 'bg-yellow-500 text-white' :
              lastReward.type === 'achievement' ? 'bg-green-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {lastReward.message}
          </motion.div>
        )}
      </AnimatePresence>
    </GamificationContext.Provider>
  );
}; 