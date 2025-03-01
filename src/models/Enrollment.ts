import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  progress: number;
  completedLessons: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Course.modules.lessons',
    }],
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only enroll once in a course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema); 