import { Request } from 'express';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthRequest extends Request {
  user?: User;
} 