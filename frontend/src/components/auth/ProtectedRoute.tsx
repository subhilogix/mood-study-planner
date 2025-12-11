import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
