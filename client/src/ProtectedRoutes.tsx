import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading, authenticateUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      await authenticateUser();
    };
    checkAuth();
  }, [authenticateUser]);
  if(isLoading) {
    return
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
