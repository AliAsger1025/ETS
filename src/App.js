import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// require('express');
// const cors = require('cors'); // Import the cors middleware
// const app = express();

// // Use the cors middleware
// // This allows all origins. For production, you should restrict it.
// app.use(cors());

// // For more specific origins (recommended for production):

// app.use(cors({
//     origin: 'http://localhost:3000' // Only allow requests from your frontend's origin
// }));
// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Main App Routes
const AppRoutes = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {isAuthenticated() && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated() ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/forgot-password" 
          element={!isAuthenticated() ? <ForgotPassword /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/reset-password/:id/:token" 
          element={!isAuthenticated() ? <ResetPassword /> : <Navigate to="/dashboard" />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {isAdmin() ? <AdminDashboard /> : <EmployeeDashboard />}
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              <Navigate to="/dashboard" /> : 
              <Navigate to="/login" />
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
