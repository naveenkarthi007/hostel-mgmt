import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import StudentSidebar from './components/layout/StudentSidebar';
import CaretakerSidebar from './components/layout/CaretakerSidebar';
import WardenSidebar from './components/layout/WardenSidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import RoomsPage from './pages/RoomsPage';
import AllocationsPage from './pages/AllocationsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import NoticesPage from './pages/NoticesPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentNotices from './pages/student/StudentNotices';
import CaretakerDashboard from './pages/caretaker/CaretakerDashboard';
import CaretakerComplaints from './pages/caretaker/CaretakerComplaints';
import WardenDashboard from './pages/warden/WardenDashboard';
import WardenStudents from './pages/warden/WardenStudents';
import WardenComplaints from './pages/warden/WardenComplaints';
import { Spinner } from './components/ui';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <Spinner size="lg" className="text-brand-primary" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/student" replace />;
  return children;
}

function CaretakerRoute({ children }) {
  const { isCaretaker, isAdmin } = useAuth();
  if (!isCaretaker && !isAdmin) return <Navigate to="/student" replace />;
  return children;
}

function WardenRoute({ children }) {
  const { isWarden, isAdmin } = useAuth();
  if (!isWarden && !isAdmin) return <Navigate to="/student" replace />;
  return children;
}

function StudentRoute({ children }) {
  const { isStudent } = useAuth();
  if (!isStudent) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user, isAdmin, isCaretaker, isWarden } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={isAdmin ? '/' : isCaretaker ? '/caretaker' : isWarden ? '/warden' : '/student'} replace /> : <LoginPage />} />

      {/* Admin Routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AdminRoute>
            <Sidebar>
              <Routes>
                <Route path="/"            element={<DashboardPage />} />
                <Route path="/students"    element={<StudentsPage />} />
                <Route path="/rooms"       element={<RoomsPage />} />
                <Route path="/allocations" element={<AllocationsPage />} />
                <Route path="/complaints"  element={<ComplaintsPage />} />
                <Route path="/notices"     element={<NoticesPage />} />
                <Route path="*"            element={<Navigate to="/" replace />} />
              </Routes>
            </Sidebar>
          </AdminRoute>
        </ProtectedRoute>
      } />

      {/* Caretaker Routes */}
      <Route path="/caretaker/*" element={
        <ProtectedRoute>
          <CaretakerRoute>
            <CaretakerSidebar>
              <Routes>
                <Route path="/"           element={<CaretakerDashboard />} />
                <Route path="/complaints" element={<CaretakerComplaints />} />
                <Route path="*"           element={<Navigate to="/caretaker" replace />} />
              </Routes>
            </CaretakerSidebar>
          </CaretakerRoute>
        </ProtectedRoute>
      } />

      {/* Warden Routes */}
      <Route path="/warden/*" element={
        <ProtectedRoute>
          <WardenRoute>
            <WardenSidebar>
              <Routes>
                <Route path="/"           element={<WardenDashboard />} />
                <Route path="/students"   element={<WardenStudents />} />
                <Route path="/complaints" element={<WardenComplaints />} />
                <Route path="*"           element={<Navigate to="/warden" replace />} />
              </Routes>
            </WardenSidebar>
          </WardenRoute>
        </ProtectedRoute>
      } />

      {/* Student Routes */}
      <Route path="/student/*" element={
        <ProtectedRoute>
          <StudentRoute>
            <StudentSidebar>
              <Routes>
                <Route path="/"           element={<StudentDashboard />} />
                <Route path="/profile"    element={<StudentProfile />} />
                <Route path="/complaints" element={<StudentComplaints />} />
                <Route path="/notices"    element={<StudentNotices />} />
                <Route path="*"           element={<Navigate to="/student" replace />} />
              </Routes>
            </StudentSidebar>
          </StudentRoute>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

const GOOGLE_CLIENT_ID = '181603728534-78tjb4gbu8p6olk8mtpqj2h2guls23vv.apps.googleusercontent.com';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: '12px', fontSize: '13px', fontFamily: 'Manrope, Segoe UI, sans-serif' },
              success: { iconTheme: { primary: '#7D53F6', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
