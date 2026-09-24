import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * ProtectedRoute component to guard routes that require specific authentication and roles.
 * Redirects unauthenticated or unauthorized users back to /login.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Protected child components
 * @param {'admin' | 'university' | 'any'} [props.requiredRole='admin'] - Required role
 */
export default function ProtectedRoute({ children, requiredRole = 'admin' }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show a secure verification state while validating session
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-sm w-full text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#123158] border-t-amber-400 rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-bold text-[#123158] mb-1 font-serif">Verifying Security Credentials</h2>
          <p className="text-xs text-slate-500">Validating official government session token...</p>
        </div>
      </div>
    );
  }

  // 1. Strict check: Unauthenticated user -> redirect to /login
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location, 
          message: 'Access Restricted: You must log in with official credentials to view the Government Admin Portal.' 
        }} 
        replace 
      />
    );
  }

  // 2. Strict Role Check: Non-admin trying to access admin portal
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location, 
          message: 'Access Denied: This portal requires official Government Administrator privileges.' 
        }} 
        replace 
      />
    );
  }

  // Session and role validated successfully
  return <>{children}</>;
}
