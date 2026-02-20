import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import { ProtectedRoute } from "./router/ProtectedRoute";
import Dashboard from "./pages/Dashboard";


export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
