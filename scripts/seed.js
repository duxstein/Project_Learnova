const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnsmart';

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
    modules: [
      {
        title: 'Introduction to ML Concepts',
        duration: '2 weeks',
        order: 1,
        lessons: [
          {
            title: 'What is Machine Learning?',
            duration: '45 minutes',
            order: 1,
            videoUrl: 'https://example.com/videos/intro-ml',
            resources: [
              {
                title: 'ML Basics PDF',
                type: 'PDF',
                url: 'https://example.com/resources/ml-basics.pdf'
              }
            ]
          }
        ]
      }
    ]
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
    modules: [
      {
        title: 'Neural Networks Fundamentals',
        duration: '3 weeks',
        order: 1,
        lessons: [
          {
            title: 'Neural Network Architecture',
            duration: '60 minutes',
            order: 1,
            videoUrl: 'https://example.com/videos/neural-networks',
            resources: [
              {
                title: 'Neural Networks Guide',
                type: 'PDF',
                url: 'https://example.com/resources/neural-networks.pdf'
              }
            ]
          }
        ]
      }
    ]
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
    modules: [
      {
        title: 'Text Processing Basics',
        duration: '2 weeks',
        order: 1,
        lessons: [
          {
            title: 'Text Preprocessing',
            duration: '50 minutes',
            order: 1,
            videoUrl: 'https://example.com/videos/text-preprocessing',
            resources: [
              {
                title: 'NLP Guide',
                type: 'PDF',
                url: 'https://example.com/resources/nlp-guide.pdf'
              }
            ]
          }
        ]
      }
    ]
  }
];

const seedCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the Course model
    const Course = mongoose.model('Course', new mongoose.Schema({
      title: String,
      description: String,
      thumbnail: String,
      instructor: {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        avatar: String,
      },
      duration: String,
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
      },
      rating: Number,
      enrolledCount: Number,
      modules: [{
        title: String,
        duration: String,
        order: Number,
        lessons: [{
          title: String,
          duration: String,
          videoUrl: String,
          order: Number,
          resources: [{
            title: String,
            type: {
              type: String,
              enum: ['PDF', 'VIDEO', 'LINK', 'CODE']
            },
            url: String
          }]
        }]
      }]
    }, { timestamps: true }));
    
    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');
    
    // Insert sample courses
    const createdCourses = await Course.insertMany(sampleCourses);
    console.log('Sample courses seeded successfully:', createdCourses);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses(); 