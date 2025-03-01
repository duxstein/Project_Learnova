import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
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