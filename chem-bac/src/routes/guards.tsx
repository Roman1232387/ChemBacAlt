import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';

/** Redirects to /login if not authenticated */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const hasValidToken = AuthService.hasValidToken();
  if (!hasValidToken) {
    if (isAuthenticated) logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
}

/** Redirects to /403 if not admin */
export function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  const hasValidToken = AuthService.hasValidToken();
  if (!isAuthenticated || !hasValidToken) {
    if (isAuthenticated) logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) return <Navigate to="/403" replace />;

  return <Outlet />;
}
