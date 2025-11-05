// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Get the "authRole" we saved in sessionStorage
  const role = sessionStorage.getItem('authRole');

  // 2. Check if the role is "admin"
  if (role === 'admin') {
    // If they are an admin, show the page they asked for
    return <Outlet />;
  }

  // 3. If they are not an admin, send them back to the login page
  // We'll set the login page to be "/" in the next step
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;