import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "./dashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
