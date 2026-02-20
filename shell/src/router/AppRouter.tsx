import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layout/DashboardLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLICA */}
        <Route path="/login" element={<Login />} />

        {/* PRIVADAS */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
