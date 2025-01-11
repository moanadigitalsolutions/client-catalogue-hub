import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: Auth state", { user, loading, currentPath: location.pathname });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Allow access to password reset page without authentication
  if (location.pathname === '/reset-password') {
    return <>{children}</>;
  }

  if (!user && location.pathname !== "/login") {
    console.log("ProtectedRoute: Redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && location.pathname === "/login") {
    console.log("ProtectedRoute: Redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;