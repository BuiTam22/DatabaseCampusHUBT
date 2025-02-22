import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AIPage from './pages/ai/AIPage';
import RankingPage from './pages/ranking/RankingPage';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import PublicLayout from './components/layout/PublicLayout';

// Pages
import Posts from './pages/Posts';
import Dashboard from './pages/Dashboard';
import CreatePost from './components/post/CreatePost';
import CreateStory from './components/story/CreateStory';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import UserManagement from './pages/admin/UserManagement';
import AdminRoute from './components/auth/AdminRoute';
import NotFound from './components/error/NotFound';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CourseManagement from './pages/CourseManagement';
import CourseDetails from './pages/CourseDetails';
import EventsPage from './pages/events/EventsPage';
import EventDetails from './pages/events/EventDetails';
import CourseLearn from './pages/CourseLearn';
import { SidebarProvider } from './contexts/SidebarContext';
import ExamPage from './pages/exam/ExamPage';
import CodingExam from './pages/exam/CodingExam';
import EssayExam from './pages/exam/EssayExam';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SidebarProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
              </Route>

              {/* Admin routes - separate layout */}
              <Route path="/admin/*" element={
                <AdminRoute>
                  <Routes>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="*" element={<Navigate to="/admin/users" replace />} />
                  </Routes>
                </AdminRoute>
              } />

              {/* Protected routes with main layout */}
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/posts" element={<Posts />} />
                <Route
                  path="/ai/chat"
                  element={
                    <PrivateRoute>
                      <AIPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/rankings" element={<RankingPage />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/create-story" element={<CreateStory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/messaging" element={<Messages />} />
                <Route path="/settings/account" element={<Settings />} />
                <Route path="/settings/preferences" element={<Settings />} />
                <Route path="/settings/privacy" element={<Settings />} />
                <Route path="/courses" element={<CourseManagement />} />
                <Route path="/courses/:courseId" element={<CourseDetails />} />
                <Route path="/courses/:courseId/learn" element={<CourseLearn />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:eventId" element={<EventDetails />} />
                <Route path="/exams" element={<ExamPage />} />
                <Route path="/coding-exam" element={<CodingExam />} />
                <Route path="/essay-exam" element={<EssayExam />} />
              </Route>

              {/* Legal routes */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* Show 404 for unknown routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;