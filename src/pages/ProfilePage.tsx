import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  BookOpen, 
  Award, 
  Clock, 
  Calendar,
  Edit,
  Save,
  X,
  CheckCircle,
  Settings,
  LogOut,
  Upload,
  Download
} from 'lucide-react';

interface ProfilePageProps {
  children: ReactNode;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    bio: 'Software developer passionate about AI and machine learning. Currently expanding my knowledge in data science and neural networks.',
    location: 'San Francisco, CA',
    occupation: 'Senior Software Engineer',
    company: 'TechInnovate Inc.',
    website: 'https://alexjohnson.dev',
    joinDate: 'January 2023',
    interests: ['Machine Learning', 'Web Development', 'Data Science', 'Mobile App Development'],
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  });
  
  const [formData, setFormData] = useState({...userData});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSaveProfile = () => {
    setUserData({...formData});
    setEditMode(false);
  };
  
  const handleCancelEdit = () => {
    setFormData({...userData});
    setEditMode(false);
  };
  
  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Completed 5 lessons in one day',
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      date: 'May 15, 2023',
      badge: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'
    },
    {
      id: 2,
      title: 'Consistency Champion',
      description: 'Maintained a 7-day learning streak',
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      date: 'May 10, 2023',
      badge: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'
    },
    {
      id: 3,
      title: 'Course Completer',
      description: 'Finished "Introduction to Machine Learning"',
      icon: <Award className="h-6 w-6 text-blue-500" />,
      date: 'April 28, 2023',
      badge: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'
    },
    {
      id: 4,
      title: 'Quiz Master',
      description: 'Scored 100% on 5 consecutive quizzes',
      icon: <Award className="h-6 w-6 text-purple-500" />,
      date: 'April 15, 2023',
      badge: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'
    }
  ];
  
  // Mock certificates data
  const certificates = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      issueDate: 'May 5, 2023',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      issueDate: 'April 20, 2023',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 3,
      title: 'Web Development Fundamentals',
      issueDate: 'March 15, 2023',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ];
  
  // Mock learning activity data
  const learningActivity = [
    {
      id: 1,
      action: 'Completed lesson',
      course: 'Neural Networks Basics',
      date: '2 days ago'
    },
    {
      id: 2,
      action: 'Earned achievement',
      course: 'Consistency Champion',
      date: '5 days ago'
    },
    {
      id: 3,
      action: 'Started course',
      course: 'Data Visualization with D3.js',
      date: '1 week ago'
    },
    {
      id: 4,
      action: 'Completed quiz',
      course: 'Machine Learning Algorithms',
      date: '1 week ago'
    },
    {
      id: 5,
      action: 'Earned certificate',
      course: 'Introduction to Machine Learning',
      date: '2 weeks ago'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
};

export default ProfilePage;