import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import EquipmentCatalog from './pages/EquipmentCatalog';
import EquipmentDetail  from './pages/EquipmentDetail';
import BookingForm      from './pages/BookingForm';
import MyBookings       from './pages/MyBookings';
import BookingDetail    from './pages/BookingDetail';
import ProfilePage      from './pages/ProfilePage';
import ProfessorDashboard from './pages/ProfessorDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard   from './pages/AdminDashboard';
import NotFoundPage     from './pages/NotFoundPage';
import StudentLayout    from './components/StudentLayout';

// Redirect to the correct home for each role
const SmartRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (user.role === 'admin')     return <Navigate to="/admin"     replace />;
  if (user.role === 'officer')   return <Navigate to="/officer"   replace />;
  if (user.role === 'professor') return <Navigate to="/professor" replace />;
  return <Navigate to="/dashboard" replace />;
};

// Role-guarded route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { fontFamily: 'Sora, sans-serif', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
              success: { iconTheme: { primary: '#0a7a45', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#c0392b', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/"         element={<SmartRedirect />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student / External portal (sidebar layout) */}
            <Route path="/" element={
              <ProtectedRoute roles={['student', 'external']}>
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard"        element={<StudentDashboard />} />
              <Route path="catalog"          element={<EquipmentCatalog />} />
              <Route path="equipment/:id"    element={<EquipmentDetail />} />
              <Route path="book/:equipmentId" element={<BookingForm />} />
              <Route path="my-bookings"      element={<MyBookings />} />
              <Route path="bookings/:id"     element={<BookingDetail />} />
              <Route path="profile"          element={<ProfilePage />} />
            </Route>

            {/* Professor approval dashboard */}
            <Route path="/professor" element={
              <ProtectedRoute roles={['professor', 'admin']}>
                <ProfessorDashboard />
              </ProtectedRoute>
            } />

            {/* Officer dashboard */}
            <Route path="/officer" element={
              <ProtectedRoute roles={['officer', 'admin']}>
                <OfficerDashboard />
              </ProtectedRoute>
            } />

            {/* Admin overview */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;