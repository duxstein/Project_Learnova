import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import ProfilePage from './pages/ProfilePage';
import CoursesPage from './pages/CoursesPage';
import OnboardingPage from './pages/OnboardingPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Gamification Components
import { Badges, Achievements, Leaderboard, ProgressBar } from './components/Gamification';
import { GamificationProvider } from './contexts/GamificationContext';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component with Onboarding Check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to onboarding if user hasn't completed it
  // Skip onboarding page itself to avoid infinite loop
  if (!user.hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

// Main App Component
function App() {
  const location = useLocation();

  // Conditionally render the Navbar based on the current route
  const hideNavbarPaths = ['/', '/login', '/signup', '/onboarding']; // Added onboarding to hidden navbar paths
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage>
                    <Badges />
                    <Achievements />
                    <Leaderboard />
                    <ProgressBar />
                  </DashboardPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:id"
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage>
                    <Badges />
                    <Achievements />
                    <ProgressBar />
                  </ProfilePage>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

// Wrapper to provide routing and context
function AppWrapper() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <Router>
          <App />
        </Router>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default AppWrapper;