import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkWrapper } from './context/ClerkWrapper';
import { AuthProvider } from './context/AuthContext';
import { SynoraProvider } from './context/SynoraContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { Landing } from './pages/Landing';
import { Explorer } from './pages/Explorer';
import { GlobalScholarshipsPage } from './pages/GlobalScholarshipsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

// Protected Pages (User-specific)
import { FindForMe } from './pages/FindForMe';
import { Dashboard } from './pages/Dashboard';
import { ApplicationTracker } from './pages/Applications';
import { SavedScholarshipsPage } from './pages/Saved';
import { ProfilePage } from './pages/Profile';
import { AdminPanel } from './pages/AdminPanel';
import { SynoraGuidePage } from './pages/SynoraGuidePage';

export default function App() {
  return (
    <ClerkWrapper>
      <BrowserRouter>
        <AuthProvider>
          <SynoraProvider>
            <div className="min-h-screen bg-[#FBFBFA] text-gray-900 flex flex-col font-sans selection:bg-black selection:text-white">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public routes — accessible without login */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/global-scholarships" element={<GlobalScholarshipsPage />} />
                  <Route path="/explorer" element={<Explorer />} />
                  <Route path="/sign-in/*" element={<SignInPage />} />
                  <Route path="/sign-up/*" element={<SignUpPage />} />

                  {/* Protected routes — require authentication */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute featureName="your Student Dashboard">
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/find-for-me" 
                    element={
                      <ProtectedRoute featureName="Personalized Scholarship Matching">
                        <FindForMe />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/applications" 
                    element={
                      <ProtectedRoute featureName="Application Progress Tracker">
                        <ApplicationTracker />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/saved" 
                    element={
                      <ProtectedRoute featureName="Saved Scholarships & Deadlines">
                        <SavedScholarshipsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute featureName="Student Academic Profile">
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute featureName="Admin Master Console">
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/guide" 
                    element={
                      <ProtectedRoute featureName="Synora Guide AI Counselor">
                        <SynoraGuidePage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SynoraProvider>
        </AuthProvider>
      </BrowserRouter>
    </ClerkWrapper>
  );
}
