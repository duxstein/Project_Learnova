import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GamificationContextType {
  points: number;
  level: number;
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  achievements: Achievement[];
  addPoints: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: number) => void;
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
}

interface Badge {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  requirement: number;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  points: number;
  rank: number;
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
  // Load state from localStorage or use defaults
  const [points, setPoints] = useState(() => 
    parseInt(localStorage.getItem('gamification_points') || '0')
  );
  const [level, setLevel] = useState(() => 
    parseInt(localStorage.getItem('gamification_level') || '1')
  );
  const [lastReward, setLastReward] = useState<Reward | null>(null);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('gamification_streak');
    return saved ? JSON.parse(saved) : { current: 0, lastLogin: new Date().toISOString() };
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('gamification_badges');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Quick Start',
        description: 'Earn your first 100 points',
        earned: false,
        requirement: 100
      },
      {
        id: 2,
        name: 'Study Streak',
        description: 'Learn for 7 consecutive days',
        earned: false,
        requirement: 7
      },
      {
        id: 3,
        name: 'Knowledge Seeker',
        description: 'Complete 5 different courses',
        earned: false,
        requirement: 5
      }
    ];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('gamification_achievements');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Early Bird',
        description: 'Study before 8 AM',
        earned: false,
        icon: '🌅'
      },
      {
        id: 2,
        name: 'Night Owl',
        description: 'Complete a lesson after 10 PM',
        earned: false,
        icon: '🌙'
      },
      {
        id: 3,
        name: 'Weekend Warrior',
        description: 'Study on both Saturday and Sunday',
        earned: false,
        icon: '⚔️'
      }
    ];
  });

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { id: 1, name: 'Sarah Johnson', points: 2500, rank: 1 },
    { id: 2, name: 'Michael Chen', points: 2350, rank: 2 },
    { id: 3, name: 'Emma Davis', points: 2200, rank: 3 },
    { id: 4, name: 'Alex Thompson', points: 2100, rank: 4 },
    { id: 5, name: 'James Wilson', points: 2000, rank: 5 }
  ]);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('gamification_points', points.toString());
    localStorage.setItem('gamification_level', level.toString());
    localStorage.setItem('gamification_badges', JSON.stringify(badges));
    localStorage.setItem('gamification_achievements', JSON.stringify(achievements));
    localStorage.setItem('gamification_streak', JSON.stringify(streak));
  }, [points, level, badges, achievements, streak]);

  const calculateLevel = (points: number) => {
    return Math.floor(points / 1000) + 1;
  };

  const calculateProgress = (points: number) => {
    const currentLevel = calculateLevel(points);
    const pointsForCurrentLevel = (currentLevel - 1) * 1000;
    const pointsForNextLevel = currentLevel * 1000;
    const current = points - pointsForCurrentLevel;
    const nextLevel = pointsForNextLevel - pointsForCurrentLevel;
    const percentage = (current / nextLevel) * 100;

    return { current, nextLevel, percentage };
  };

  const updateStreak = () => {
    const today = new Date();
    const lastLogin = new Date(streak.lastLogin);
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      setStreak(prev => ({
        current: prev.current + 1,
        lastLogin: today.toISOString()
      }));
      addPoints(50, 'Daily Streak Bonus');
    } else if (diffDays > 1) {
      // Streak broken
      setStreak({
        current: 1,
        lastLogin: today.toISOString()
      });
    }
  };

  const addPoints = (amount: number, reason?: string) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    
    const newLevel = calculateLevel(newPoints);
    if (newLevel > level) {
      setLevel(newLevel);
      setLastReward({
        type: 'level',
        message: `Level Up! You're now level ${newLevel}`,
        timestamp: Date.now()
      });
    } else if (reason) {
      setLastReward({
        type: 'points',
        message: `+${amount} points: ${reason}`,
        timestamp: Date.now()
      });
    }

    // Check for badge unlocks
    badges.forEach(badge => {
      if (!badge.earned && newPoints >= badge.requirement) {
        unlockBadge(badge.id);
      }
    });
  };

  const unlockBadge = (badgeId: number) => {
    setBadges(prevBadges =>
      prevBadges.map(badge =>
        badge.id === badgeId 
          ? { ...badge, earned: true }
          : badge
      )
    );
    setLastReward({
      type: 'badge',
      message: `New Badge: ${badges.find(b => b.id === badgeId)?.name}`,
      timestamp: Date.now()
    });
  };

  const unlockAchievement = (achievementId: number) => {
    setAchievements(prev =>
      prev.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, earned: true }
          : achievement
      )
    );
    setLastReward({
      type: 'achievement',
      message: `New Achievement: ${achievements.find(a => a.id === achievementId)?.name}`,
      timestamp: Date.now()
    });
    addPoints(100, 'Achievement Unlocked');
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
    progress: calculateProgress(points),
    lastReward,
    streak,
    updateStreak
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