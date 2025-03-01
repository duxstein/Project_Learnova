import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  type: 'PDF' | 'VIDEO' | 'LINK' | 'CODE';
  url: string;
}

export interface ILesson extends Document {
  title: string;
  duration: string;
  content?: string;
  videoUrl?: string;
  order: number;
  resources: IResource[];
}

export interface IModule extends Document {
  title: string;
  duration: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledCount: number;
  modules: IModule[];
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['PDF', 'VIDEO', 'LINK', 'CODE'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  content: String,
  videoUrl: String,
  order: {
    type: Number,
    required: true,
  },
  resources: [resourceSchema],
});

const moduleSchema = new Schema<IModule>({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  lessons: [lessonSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    instructor: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: String,
    },
    duration: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    rating: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    modules: [moduleSchema],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course; 