import { Document, Types } from 'mongoose';
import { UserPreferences } from './userPreferences';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'instructor';
  avatar?: string;
  points: number;
  level: number;
  lastLoginAt?: Date;
  currentStreak: number;
  badges: Types.ObjectId[];
  hasCompletedOnboarding: boolean;
  preferences: UserPreferences | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserResponse = Omit<IUser, 'password'>;

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  hasCompletedOnboarding: boolean;
  preferences?: UserPreferences | null;
}; 