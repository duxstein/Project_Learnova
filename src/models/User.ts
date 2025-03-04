import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user';

interface UserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'instructor'],
      default: 'user',
    },
    avatar: {
      type: String,
    },
    // Gamification fields
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    lastLoginAt: {
      type: Date,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    badges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
    }],
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
    preferences: {
      type: {
        learningStyle: String,
        learningPace: String,
        learningApproach: String,
        preferredTime: String,
        sessionDuration: String,
        learningEnvironment: String,
        learningStrength: String,
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User; 