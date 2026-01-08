import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-logo">
            <div className="site-logo-circle">Y</div>
            <div>
              <div className="site-logo-title">LFE Y-SPORT</div>
              <div className="site-logo-subtitle">Association e-sport étudiante</div>
            </div>
          </div>

          <nav className="site-nav">
            <NavLink to="/" end className={({ isActive }) => "site-nav-link" + (isActive ? " active" : "")}>
              Accueil
            </NavLink>
            <NavLink to="/teams" className={({ isActive }) => "site-nav-link" + (isActive ? " active" : "")}>
              Équipes
            </NavLink>
            <NavLink to="/planning" className={({ isActive }) => "site-nav-link" + (isActive ? " active" : "")}>
              Planning
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} LFE Y-SPORT – Projet étudiant e-sport.</p>
      </footer>
    </div>
  );
}
