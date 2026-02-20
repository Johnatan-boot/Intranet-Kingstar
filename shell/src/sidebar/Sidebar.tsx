import "./sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      
      {/* LOGO / TÍTULO */}
      <div className="sidebar-header">
        <h2>Kingstar</h2>
        <span>Intranet</span>
      </div>

      {/* LINKS */}
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/admin">
          Administração
        </NavLink>

        <NavLink to="/logistica">
          Logística
        </NavLink>
      </nav>
    </aside>
  );
}
