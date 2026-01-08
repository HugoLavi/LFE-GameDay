import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { api } from "../api/client";

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function Home() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const res = await api.get("matches/upcoming/");
        setUpcoming(res.data.slice(0, 5));
      } catch (e) {
        console.error("Erreur mini calendrier", e);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, []);

  return (
    <div className="page">
      <Navigation />

      <section className="hero">
        <div className="blob one" />
        <div className="blob two" />

        <div className="hero-wrapper">
          <div className="hero-content">
            <div className="logo-big">
              <span>LFE</span>
            </div>

            <h1 className="hero-title">LFE GAME DAY</h1>
            <p className="hero-subtitle">Association Esport Française</p>

            <p className="hero-text">
              Suis les équipes, les matchs en direct, les replays et le planning officiel.
            </p>

            <div className="hero-actions">
              <Link to="/planning" className="btn btn-primary">
                Voir le planning
              </Link>
              <Link to="/equipes" className="btn btn-outline">
                Nos équipes
              </Link>
            </div>

            {/* ✅ cartes centrées + responsive */}
            <div className="hero-cards">
              <div className="card card-pad">
                <h2 className="card-title">Pourquoi LFE Y-SPORT ?</h2>
                <p className="p-sub">
                  Une communauté e-sport orientée compétition (LoL) : rosters, matchs à venir,
                  résultats et replays au même endroit.
                </p>
              </div>

              <div className="card soft card-pad">
                <h2 className="card-title">Prochains matchs</h2>

                {loading ? (
                  <p className="p-sub">Chargement...</p>
                ) : upcoming.length === 0 ? (
                  <p className="p-sub">Aucun match prévu pour le moment.</p>
                ) : (
                  <ul className="mini-list">
                    {upcoming.map((m) => (
                      <li key={m.id} className="mini-item">
                        <div className="mini-date">{formatShortDate(m.date)}</div>
                        <div className="mini-match">
                          {m.team_a_name} vs {m.team_b_name}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <Link to="/planning" className="small-link">
                  Voir le planning complet →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
