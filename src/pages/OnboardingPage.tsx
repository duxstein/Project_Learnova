import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Brain, Loader } from 'lucide-react';
import userPreferencesApi from '../api/userPreferencesApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How do you best retain information?",
    options: [
      "📖 Reading & summarizing",
      "🎥 Watching videos & visuals",
      "📝 Practicing with hands-on exercises",
      "🎙️ Listening to audio explanations",
      "👥 Engaging in group discussions"
    ]
  },
  {
    id: 2,
    text: "What's your learning pace preference?",
    options: [
      "🏃‍♂️ Fast-paced learning (quick progress, shorter courses)",
      "🏗️ Step-by-step learning (deep dives, longer courses)",
      "🎯 Goal-oriented learning (only what's necessary for a specific skill)"
    ]
  },
  {
    id: 3,
    text: "How do you usually tackle new topics?",
    options: [
      "I like to explore and experiment",
      "I prefer structured guidance and clear instructions",
      "I need motivation (e.g., deadlines, accountability)",
      "I get overwhelmed easily and need bite-sized content"
    ]
  },
  {
    id: 4,
    text: "When do you prefer to study?",
    options: [
      "🌅 Morning",
      "☀️ Afternoon",
      "🌙 Night",
      "🕒 No specific time"
    ]
  },
  {
    id: 5,
    text: "How much time can you dedicate to learning per session?",
    options: [
      "⏳ 10-15 mins (micro-learning)",
      "🕰️ 30-60 mins",
      "⏱️ 1-2 hrs",
      "⏳ More than 2 hrs"
    ]
  },
  {
    id: 6,
    text: "What's your preferred learning environment?",
    options: [
      "📱 Mobile-friendly quick sessions",
      "💻 Deep focus on a desktop/laptop",
      "🎧 Audio-based learning while multitasking",
      "📚 Printable notes & workbooks"
    ]
  },
  {
    id: 7,
    text: "What is your biggest strength in learning?",
    options: [
      "🧠 I grasp concepts quickly",
      "📅 I am disciplined and consistent",
      "🤔 I am a problem-solver",
      "🛠️ I am good at practical applications"
    ]
  }
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: answer }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userPreferencesApi.submitPreferences(answers);
      toast.success('Preferences saved successfully!');
      
      // Show a message about the AI analyzing their preferences
      toast.success('AI is analyzing your preferences to create personalized recommendations...', {
        duration: 3000
      });
      
      // Refresh user data to update hasCompletedOnboarding status
      await checkAuth();
      
      // Navigate to dashboard with the recommendations
      navigate('/dashboard', { 
        state: { 
          recommendations: response.recommendations,
          showWelcome: true
        }
      });
    } catch (err: any) {
      console.error('Error submitting preferences:', err);
      setError(err.response?.data?.message || 'Failed to save preferences. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Let's Personalize Your Learning Journey
          </h1>
          <p className="text-gray-600">
            Answer a few questions to help us recommend the best courses for you
          </p>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                  answers[questions[currentQuestion].id] === option
                    ? 'bg-primary-100 border-2 border-primary-500 text-primary-700'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            {currentQuestion === questions.length - 1 && Object.keys(answers).length === questions.length && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary py-2 px-6 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Complete
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage; 