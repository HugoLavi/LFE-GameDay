import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { api } from "../api/client";

function formatDateFR(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

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

export default function Rediffs() {
  const [replays, setReplays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReplays() {
      try {
        const res = await api.get("events/replays/");
        setReplays(res.data);
      } catch (e) {
        console.error("Erreur rediffs", e);
      } finally {
        setLoading(false);
      }
    }
    fetchReplays();
  }, []);

  return (
    <div className="page">
      <Navigation />

      <section className="section">
        <div className="container">
          <h1 className="h1">Rediffusions</h1>
          <p className="p-sub" style={{ marginBottom: 32 }}>
            Retrouve ici toutes les soirées Game Day passées — replays et résumés.
          </p>

          {loading ? (
            <p className="p-sub">Chargement...</p>
          ) : replays.length === 0 ? (
            <div className="rediff-empty">
              <span>🎬</span>
              <p>Aucune rediffusion disponible pour le moment.</p>
              <p className="p-sub">Les replays des prochaines soirées apparaîtront ici.</p>
            </div>
          ) : (
            <div className="event-cards-grid">
              {replays.map((event) => {
                const img = getEventImage(event);
                const hasReplay = Boolean(event.replay_url);

                return (
                  <div key={event.id} className="ev-card rediff-card">
                    {/* Image */}
                    <div className="ev-card-img">
                      {img ? (
                        <img src={img} alt={event.title} />
                      ) : (
                        <div className="ev-card-img-placeholder">
                          <span>🎮</span>
                        </div>
                      )}
                      {/* Overlay play si replay dispo */}
                      {hasReplay && (
                        <a
                          href={event.replay_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rediff-play-overlay"
                        >
                          <span className="rediff-play-icon">▶</span>
                        </a>
                      )}
                      <span className="ev-card-live-badge" style={{ background: "var(--violet-profond)" }}>
                        TERMINÉ
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="ev-card-body">
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
                          <span>📍 Lieu</span>
                          {event.location || "Ynov Campus Lille"}
                        </div>
                      </div>

                      {hasReplay ? (
                        <a
                          className="btn btn-primary"
                          href={event.replay_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginTop: 8, width: "100%", justifyContent: "center" }}
                        >
                          ▶ Voir la rediffusion
                        </a>
                      ) : (
                        <div
                          className="btn btn-outline"
                          style={{ marginTop: 8, width: "100%", justifyContent: "center", cursor: "default", opacity: 0.5 }}
                        >
                          Rediffusion bientôt disponible
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
