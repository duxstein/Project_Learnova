const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course').default;
const connectDB = require('../config/database').default;

dotenv.config();

const sampleCourses = [
  {
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning, including supervised and unsupervised learning, model evaluation, and practical applications.',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    instructor: {
      id: new mongoose.Types.ObjectId(),
      name: 'Dr. Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    duration: '8 weeks',
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: 1250,
  },
  {
    title: 'Advanced Deep Learning',
    description: 'Dive deep into neural networks, convolutional networks, and transformers. Build real-world AI applications.',
    thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
    instructor: {
      id: new mongoose.Types.ObjectId(),
      name: 'Prof. Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    duration: '12 weeks',
    level: 'Advanced',
    rating: 4.9,
    enrolledCount: 850,
  },
  {
    title: 'Natural Language Processing',
    description: 'Master text processing, sentiment analysis, and language generation using modern NLP techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2',
    instructor: {
      id: new mongoose.Types.ObjectId(),
      name: 'Dr. Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    duration: '10 weeks',
    level: 'Intermediate',
    rating: 4.7,
    enrolledCount: 975,
  }
];

const seedCourses = async () => {
  try {
    await connectDB();
    
    // Clear existing courses
    await Course.deleteMany({});
    
    // Insert sample courses
    const createdCourses = await Course.insertMany(sampleCourses);
    
    console.log('Sample courses seeded successfully:', createdCourses);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses(); 