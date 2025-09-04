import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { RealTimeProvider } from './context/RealTimeContext.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VideoDetail from './pages/VideoDetail.jsx';
import Channel from './pages/Channel.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import VideoUpload from './components/video/VideoUpload.jsx';
import Search from './pages/Search.jsx';
import PlaylistDetail from './pages/PlaylistDetail.jsx';
import SubscriptionFeed from './pages/SubscriptionFeed.jsx';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <RealTimeProvider>
              <Router>
                <Routes>
                  {/* Public routes without layout */}
                  <Route path="/login" element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } />
                  <Route path="/register" element={
                    <ProtectedRoute requireAuth={false}>
                      <Register />
                    </ProtectedRoute>
                  } />

                  {/* Routes with layout */}
                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/video/:id" element={<VideoDetail />} />
                        <Route path="/channel/:username" element={<Channel />} />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                        <Route path="/upload" element={
                          <ProtectedRoute>
                            <VideoUpload />
                          </ProtectedRoute>
                        } />
                        <Route path="/subscriptions" element={
                          <ProtectedRoute>
                            <SubscriptionFeed />
                          </ProtectedRoute>
                        } />
                        <Route path="/library" element={
                          <ProtectedRoute>
                            <div>Library Page</div>
                          </ProtectedRoute>
                        } />
                        <Route path="/history" element={
                          <ProtectedRoute>
                            <div>History Page</div>
                          </ProtectedRoute>
                        } />
                        <Route path="/trending" element={<div>Trending Page</div>} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/playlist/:id" element={<PlaylistDetail />} />
                        <Route path="*" element={<div>404 - Page Not Found</div>} />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
              </Router>
            </RealTimeProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
