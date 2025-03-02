import { Document, Types } from 'mongoose';

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
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserResponse = Omit<IUser, 'password'>;

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}; 