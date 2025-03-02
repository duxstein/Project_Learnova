import mongoose, { Document } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  requirement: number;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new mongoose.Schema<IBadge>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    requirement: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.model<IBadge>('Badge', badgeSchema);

export default Badge; 