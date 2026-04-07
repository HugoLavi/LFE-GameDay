import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { api } from "../api/client";

function formatDateFR(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Fallback image par défaut si pas d'image_url
const FALLBACK_IMAGES = {
  "street fighter": "https://upload.wikimedia.org/wikipedia/en/4/44/Street_Fighter_6_cover.jpg",
  "mario party": "https://upload.wikimedia.org/wikipedia/en/2/28/Super_Mario_Party_cover.jpg",
};

function getEventImage(event) {
  if (event.image_url) return event.image_url;
  const key = Object.keys(FALLBACK_IMAGES).find((k) =>
    event.title.toLowerCase().includes(k)
  );
  return key ? FALLBACK_IMAGES[key] : null;
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [replays, setReplays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReplays, setLoadingReplays] = useState(true);

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const res = await api.get("events/upcoming/");
        setEvents(res.data.slice(0, 3));
      } catch (e) {
        console.error("Erreur événements à venir", e);
      } finally {
        setLoading(false);
      }
    }
    async function fetchReplays() {
      try {
        const res = await api.get("events/replays/");
        setReplays(res.data.slice(0, 3));
      } catch (e) {
        console.error("Erreur rediffs", e);
      } finally {
        setLoadingReplays(false);
      }
    }
    fetchUpcomingEvents();
    fetchReplays();
  }, []);

  return (
    <div className="page">
      <Navigation />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="blob one" />
        <div className="blob two" />

        <div className="hero-wrapper">
          <div className="hero-content">

            <h1 className="hero-title">
              Game <span className="highlight">Day</span>
            </h1>
            <p className="hero-subtitle">by LFE · Ynov Campus Lille</p>

            <p className="hero-text">
              Les soirées gaming du campus — tournois, party games et bonne ambiance.
              Rejoins la communauté et ne rate aucun événement !
            </p>

            <div className="hero-actions">
              <Link to="/planning" className="btn btn-primary">
                Voir les événements
              </Link>
              <Link to="/rediffs" className="btn btn-outline">
                Rediffs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prochains événements ── */}
      <section className="section">
        <div className="container">
          <h2 className="home-section-title">Prochains Game Days</h2>
          <p className="p-sub" style={{ marginBottom: 28 }}>
            Les prochaines soirées organisées par LFE · Ynov Campus Lille - Studio 02
          </p>

          {loading ? (
            <p className="p-sub">Chargement...</p>
          ) : events.length === 0 ? (
            <p className="p-sub">Aucun événement prévu pour le moment.</p>
          ) : (
            <div className="event-cards-grid">
              {events.map((event) => {
                const img = getEventImage(event);
                const isLive = event.status === "live";

                return (
                  <div key={event.id} className="ev-card">
                    {/* Image */}
                    <div className="ev-card-img">
                      {img ? (
                        <img src={img} alt={event.title} />
                      ) : (
                        <div className="ev-card-img-placeholder">
                          <span>🎮</span>
                        </div>
                      )}
                      {isLive && (
                        <span className="ev-card-live-badge">🔴 EN DIRECT</span>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="ev-card-body">
                      <div className="ev-card-badge">À VENIR</div>
                      <h3 className="ev-card-title">{event.title}</h3>

                      {event.description && (
                        <p className="ev-card-desc">{event.description}</p>
                      )}

                      <div className="ev-card-meta">
                        <div className="ev-card-meta-item">
                          <span>📅 Date</span>
                          {formatDateFR(event.date)}
                        </div>
                        <div className="ev-card-meta-item">
                          <span>🕐 Heure</span>
                          {event.time}
                        </div>
                        <div className="ev-card-meta-item" style={{ gridColumn: "1 / -1" }}>
                          <span>📍 Lieu</span>
                          {event.location || "Ynov Campus Lille - Studio 02"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link to="/planning" className="btn btn-primary">
              Voir le planning complet →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dernières rediffs ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="home-section-title">Dernières rediffusions</h2>
          <p className="p-sub" style={{ marginBottom: 28 }}>
            Tu as raté une soirée ? Retrouve les replays des Game Days passés.
          </p>

          {loadingReplays ? (
            <p className="p-sub">Chargement...</p>
          ) : replays.length === 0 ? (
            <div className="rediff-empty">
              <span>🎬</span>
              <p>Les replays des prochaines soirées apparaîtront ici.</p>
            </div>
          ) : (
            <div className="event-cards-grid">
              {replays.map((event) => {
                const img = getEventImage(event);
                const hasReplay = Boolean(event.replay_url);

                return (
                  <div key={event.id} className="ev-card rediff-card">
                    <div className="ev-card-img">
                      {img ? (
                        <img src={img} alt={event.title} />
                      ) : (
                        <div className="ev-card-img-placeholder"><span>🎮</span></div>
                      )}
                      {hasReplay && (
                        <a href={event.replay_url} target="_blank" rel="noreferrer" className="rediff-play-overlay">
                          <span className="rediff-play-icon">▶</span>
                        </a>
                      )}
                      <span className="ev-card-live-badge" style={{ background: "var(--violet-profond)" }}>
                        TERMINÉ
                      </span>
                    </div>

                    <div className="ev-card-body">
                      <h3 className="ev-card-title">{event.title}</h3>
                      {event.description && <p className="ev-card-desc">{event.description}</p>}
                      <div className="ev-card-meta">
                        <div className="ev-card-meta-item">
                          <span>📅 Date</span>
                          {formatDateFR(event.date)}
                        </div>
                        <div className="ev-card-meta-item">
                          <span>📍 Lieu</span>
                          {event.location || "Ynov Campus Lille"}
                        </div>
                      </div>
                      {hasReplay ? (
                        <a className="btn btn-primary" href={event.replay_url} target="_blank" rel="noreferrer"
                          style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
                          ▶ Voir la rediffusion
                        </a>
                      ) : (
                        <div className="btn btn-outline"
                          style={{ marginTop: 8, width: "100%", justifyContent: "center", cursor: "default", opacity: 0.5 }}>
                          Rediffusion bientôt disponible
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link to="/rediffs" className="btn btn-outline">
              Toutes les rediffusions →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
