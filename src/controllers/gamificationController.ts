import { Request, Response, RequestHandler } from 'express';
import { AuthRequest } from '../types/auth';
import { Types, Document } from 'mongoose';
import User from '../models/User';
import Badge, { IBadge } from '../models/Badge';
import { IUser } from '../types/user';

export const getUserData: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId).populate('badges') as IUser & Document;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Recalculate level based on current points
    const calculatedLevel = calculateLevel(user.points);
    if (calculatedLevel !== user.level) {
      console.log(`Updating level from ${user.level} to ${calculatedLevel} based on points: ${user.points}`);
      user.level = calculatedLevel;
      await user.save();
    }

    // Calculate level progress
    const progress = calculateProgress(user.points);
    console.log('User data progress calculation:', progress);

    res.json({
      name: user.name,
      points: user.points,
      level: user.level,
      badges: user.badges,
      currentStreak: user.currentStreak,
      lastLoginAt: user.lastLoginAt,
      levelProgress: progress
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLeaderboard: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching leaderboard data...');
    
    // Fetch top 10 users sorted by points in descending order
    const users = await User.aggregate([
      { 
        $sort: { 
          points: -1 
        } 
      },
      { 
        $project: {
          name: 1,
          points: 1,
          level: 1,
          _id: 1
        }
      },
      { 
        $limit: 10 
      }
    ]).exec();

    console.log('Retrieved users from aggregate:', JSON.stringify(users, null, 2));

    if (!users || users.length === 0) {
      console.log('No users found in leaderboard query');
      res.status(404).json({
        success: false,
        message: 'No leaderboard data available'
      });
      return;
    }

    // Map the results to include rank and level progress
    const leaderboard = users.map((user, index) => {
      const progress = calculateProgress(user.points);
      return {
        rank: index + 1,
        name: user.name || 'Anonymous',
        points: user.points || 0,
        level: user.level || 1,
        levelProgress: {
          current: progress.current,
          nextLevel: progress.nextLevel,
          percentage: progress.percentage
        }
      };
    });

    console.log('Final formatted leaderboard:', JSON.stringify(leaderboard, null, 2));

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching leaderboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateStreak: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId) as IUser & Document;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const today = new Date();
    const lastLogin = user.lastLoginAt || today;
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = user.currentStreak;
    let pointsToAdd = 0;

    if (diffDays === 1) {
      newStreak += 1;
      pointsToAdd = 5;
    } else if (diffDays > 1) {
      newStreak = 1;
      pointsToAdd = 5;
    }

    user.currentStreak = newStreak;
    user.lastLoginAt = today;
    
    if (pointsToAdd > 0) {
      console.log(`Adding ${pointsToAdd} points for daily login`);
      user.points += pointsToAdd;
    }

    const oldLevel = user.level;
    const newLevel = calculateLevel(user.points);
    
    if (newLevel > oldLevel) {
      console.log(`Leveling up from ${oldLevel} to ${newLevel}`);
      user.level = newLevel;
    }

    await user.save();

    // Calculate progress after saving
    const progress = calculateProgress(user.points);
    console.log('Level progress after streak update:', progress);

    res.json({
      points: user.points,
      level: user.level,
      levelProgress: progress,
      streak: {
        current: user.currentStreak,
        lastLogin: user.lastLoginAt
      }
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const calculateLevel = (points: number): number => {
  let levelPoints = 1000; // Base points for level 1
  let currentLevel = 1;
  let accumulatedPoints = 0;

  console.log(`Calculating level for ${points} points`);

  while (points >= accumulatedPoints + levelPoints) {
    console.log(`Level ${currentLevel}: Need ${levelPoints} points, Accumulated: ${accumulatedPoints}`);
    accumulatedPoints += levelPoints;
    currentLevel++;
    levelPoints = Math.floor(levelPoints * 1.8);
  }

  console.log(`Final level: ${currentLevel}, Total accumulated points needed: ${accumulatedPoints}`);
  return currentLevel;
};

const calculateProgress = (points: number): { current: number; nextLevel: number; percentage: number } => {
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

  console.log(`Progress calculation:
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

export const addPoints: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { amount } = req.body;
    if (typeof amount !== 'number') {
      res.status(400).json({ message: 'Invalid amount' });
      return;
    }

    const user = await User.findById(userId) as IUser & Document;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const oldPoints = user.points;
    const oldLevel = user.level;
    user.points += amount;
    const newLevel = calculateLevel(user.points);
    
    console.log(`User points: ${oldPoints} -> ${user.points}`);
    console.log(`User level: ${oldLevel} -> ${newLevel}`);

    if (newLevel > user.level) {
      console.log(`Leveling up from ${user.level} to ${newLevel}`);
      user.level = newLevel;
    }

    await user.save();

    // Calculate progress after saving
    const progress = calculateProgress(user.points);
    console.log('Level progress:', progress);

    // Convert existing badge IDs to ObjectId
    const badges = user.badges || [];
    const currentBadgeIds: Types.ObjectId[] = badges.map((badgeId: Types.ObjectId | string) => 
      badgeId instanceof Types.ObjectId ? badgeId : new Types.ObjectId(String(badgeId))
    );

    type BadgeDocument = Document & { _id: Types.ObjectId };
    const availableBadges = await Badge.find({
      requirement: { $lte: user.points },
      _id: { $nin: currentBadgeIds }
    }).select('_id').exec() as BadgeDocument[];

    if (availableBadges.length > 0) {
      const newBadgeIds = availableBadges.map(doc => doc._id);
      user.badges = currentBadgeIds.concat(newBadgeIds);
      await user.save();
    }

    res.json({
      points: user.points,
      level: user.level,
      levelProgress: progress
    });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unlockBadge: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { badgeId } = req.body as { badgeId: string };
    if (!badgeId || typeof badgeId !== 'string') {
      res.status(400).json({ message: 'Invalid badge ID' });
      return;
    }

    const user = await User.findById(userId) as IUser & Document;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!Types.ObjectId.isValid(badgeId)) {
      res.status(400).json({ message: 'Invalid badge ID format' });
      return;
    }

    const badgeObjectId = new Types.ObjectId(badgeId);
    type BadgeDocument = Document & { _id: Types.ObjectId };
    const badge = await Badge.findById(badgeObjectId).select('_id').exec() as BadgeDocument;
    if (!badge) {
      res.status(404).json({ message: 'Badge not found' });
      return;
    }

    // Convert existing badge IDs to ObjectId
    const badges = user.badges || [];
    const currentBadgeIds: Types.ObjectId[] = badges.map((badgeId: Types.ObjectId | string) => 
      badgeId instanceof Types.ObjectId ? badgeId : new Types.ObjectId(String(badgeId))
    );

    if (!currentBadgeIds.some(id => id.equals(badge._id))) {
      user.badges = currentBadgeIds.concat([badge._id]);
      await user.save();
    }

    const updatedUser = await User.findById(userId).populate('badges').select('badges').exec();
    res.json({ badges: updatedUser?.badges || [] });
  } catch (error) {
    console.error('Error unlocking badge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 