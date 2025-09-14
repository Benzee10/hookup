
import React from 'react';
import { createHashRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import BuyCreditsPage from './pages/BuyCreditsPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const Root = () => (
  <NotificationProvider>
    <AuthProvider>
      <DataProvider>
        <Layout />
      </DataProvider>
    </AuthProvider>
  </NotificationProvider>
);

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<HomePage />} />
      <Route path="profile/:id" element={<ProfilePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="buy-credits" element={<ProtectedRoute><BuyCreditsPage /></ProtectedRoute>} />
      <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="*" element={<div>App Loaded - Route Not Found</div>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;