import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: Auth state", { user, loading, currentPath: location.pathname });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
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