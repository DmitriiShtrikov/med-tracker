// src/app/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // Если нет НИ ОДНОГО токена — выкидываем на логин
  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};