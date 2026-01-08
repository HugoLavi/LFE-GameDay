import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="nav">
      <div className="container">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-badge">LFE</div>
            <div className="brand-title">LFE Y-SPORT</div>
          </div>

          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              Accueil
            </NavLink>
            <NavLink to="/planning" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              Planning
            </NavLink>
            <NavLink to="/equipes" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              Équipes
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
