import mongoose, { Document } from 'mongoose';

export interface ICourse extends Document {
  Title: string;
  URL: string;
  "Short Intro": string;
  Category: string;
  "Sub-Category": string;
  "Course Type": string;
  Language: string;
  "Subtitle Languages": string;
  Skills: string;
  Instructors: string;
  Rating: string;
  "Number of viewers": string;
  Duration: string;
  Site: string;
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
    Title: {
      type: String,
      required: true,
    },
    URL: {
      type: String,
      required: true,
    },
    "Short Intro": {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    "Sub-Category": {
      type: String,
      required: true,
    },
    "Course Type": {
      type: String,
      required: true,
    },
    Language: {
      type: String,
      required: true,
    },
    "Subtitle Languages": {
      type: String,
      required: true,
    },
    Skills: {
      type: String,
      required: true,
    },
    Instructors: {
      type: String,
      required: true,
    },
    Rating: {
      type: String,
      required: true,
    },
    "Number of viewers": {
      type: String,
      required: true,
    },
    Duration: {
      type: String,
      required: true,
    },
    Site: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course; 