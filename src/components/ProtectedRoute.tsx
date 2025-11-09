// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
// --- 1. IMPORT THE useAuth HOOK ---
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute() {
  // --- 2. GET AUTH DATA FROM OUR GLOBAL CONTEXT ---
  const { user, profile, loading } = useAuth();

  // --- 3. REMOVE ALL THE OLD useState/useEffect LOGIC ---
  // All that is now handled by AuthContext

  // --- 4. IMPLEMENT THE NEW SECURITY LOGIC ---
  
  // While the AuthContext is loading the user, show a loading message
  if (loading) {
    return <div>Loading session...</div>;
  }

  // If there is a user AND their role is 'admin', show the page
  if (user && profile?.role === 'admin') {
    return <Outlet />; // This renders the <AdminPage />
  }

  // If there is a user but they are NOT an admin, send them to their dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If there is no user, send them to the login page
  return <Navigate to="/" replace />;
}