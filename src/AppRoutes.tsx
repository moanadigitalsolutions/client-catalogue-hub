import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ClientForm from "./pages/ClientForm";
import ClientList from "./pages/ClientList";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Registration from "./pages/Registration";
import FormBuilder from "./pages/FormBuilder";
import PublicForm from "./pages/PublicForm";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forms/:publicUrlKey" element={<PublicForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:id" element={<ClientForm />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="registration" element={<Registration />} />
          <Route path="registration/new" element={<FormBuilder />} />
          <Route path="registration/:id" element={<FormBuilder />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;