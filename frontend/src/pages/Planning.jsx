import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { api } from "../api/client";

function getDayMonth(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("fr-FR", { day: "2-digit" }),
    month: d.toLocaleDateString("fr-FR", { month: "short" }),
  };
}

function formatDateLong(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Planning() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("events/");
        const sorted = [...res.data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEvents(sorted);
      } catch (e) {
        console.error("Erreur Planning événements", e);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="page">
      <Navigation />

      <section className="section">
        <div className="container">

          <div className="planning-header">
            <h1 className="h1">Planning Game Day</h1>
            <p className="p-sub">
              Tous les événements organisés par LFE · Ynov Campus Lille - Studio 02
            </p>
          </div>

          {loading ? (
            <p className="p-sub">Chargement...</p>
          ) : events.length === 0 ? (
            <p className="p-sub">Aucun événement enregistré.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {events.map((event) => {
                const isLive     = event.status === "live";
                const isUpcoming = event.status === "upcoming";
                const isFinished = event.status === "finished";
                const { day, month } = getDayMonth(event.date);

                const cardBg = isFinished
                  ? "rgba(172, 153, 193, 0.08)"
                  : "rgba(105, 64, 145, 0.22)";
                const cardBorder = isLive
                  ? "1px solid rgba(255, 68, 68, 0.6)"
                  : isUpcoming
                    ? "1px solid rgba(255, 223, 7, 0.45)"
                    : "1px solid rgba(105, 64, 145, 0.35)";

                return (
                  <div
                    key={event.id}
                    className="planning-card"
                    style={{ background: cardBg, border: cardBorder }}
                  >
                    {/* Date block */}
                    <div
                      className="planning-card-date"
                      style={isFinished ? { background: "var(--lilas)", opacity: 0.7 } : {}}
                    >
                      <span className="day">{day}</span>
                      <span className="month">{month}</span>
                    </div>

                    {/* Content */}
                    <div className="planning-card-body">
                      <div className="planning-card-meta">
                        {isLive && (
                          <span className="planning-card-badge badge-live">🔴 EN DIRECT</span>
                        )}
                        {isUpcoming && (
                          <span className="planning-card-badge badge-upcoming">À VENIR</span>
                        )}
                        {isFinished && (
                          <span className="planning-card-badge badge-finished">TERMINÉ</span>
                        )}
                      </div>

                      <div className="planning-card-title" style={{ fontFamily: "'Oxanium', sans-serif", fontWeight: 800 }}>{event.title}</div>

                      {event.description ? (
                        <p className="p-sub" style={{ margin: 0, fontSize: 14 }}>
                          {event.description}
                        </p>
                      ) : null}

                      <div className="planning-card-meta" style={{ marginTop: 4 }}>
                        <span className="planning-card-loc">
                          🕐 {event.time}
                        </span>
                        {event.location && (
                          <span className="planning-card-loc">
                            📍 {event.location}
                          </span>
                        )}
                        {event.participants > 0 && (
                          <span className="planning-card-loc">
                            👥 {event.participants} participants
                          </span>
                        )}
                      </div>

                      <p className="p-sub" style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
                        {formatDateLong(event.date)}
                      </p>
                    </div>

                    {/* Action — lien live/replay uniquement si disponible */}
                    {(isLive && event.live_url) || (isFinished && event.replay_url) ? (
                      <div className="planning-card-action">
                        {isLive && event.live_url && (
                          <a className="btn btn-primary" href={event.live_url} target="_blank" rel="noreferrer">
                            ▶ Live
                          </a>
                        )}
                        {isFinished && event.replay_url && (
                          <a className="btn btn-outline" href={event.replay_url} target="_blank" rel="noreferrer">
                            Replay
                          </a>
                        )}
                      </div>
                    ) : null}
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
