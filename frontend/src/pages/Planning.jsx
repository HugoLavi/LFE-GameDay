import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { api } from "../api/client";

function formatDateFR(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeFR(dateStr) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Planning() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await api.get("matches/");
        const sorted = [...res.data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setMatches(sorted);
      } catch (e) {
        console.error("Erreur Planning", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  return (
    <div className="page">
      <Navigation />

      <section className="section">
        <div className="container">
          <h1 className="h1">Planning des matchs</h1>
          <p className="p-sub">Suivez les matchs en direct et consultez les replays.</p>

          {loading ? (
            <p className="p-sub" style={{ marginTop: 16 }}>
              Chargement...
            </p>
          ) : matches.length === 0 ? (
            <p className="p-sub" style={{ marginTop: 16 }}>
              Aucun match enregistré.
            </p>
          ) : (
            <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
              {matches.map((m) => {
                const isLive = m.status === "live";
                const isUpcoming = m.status === "upcoming";
                const isFinished = m.status === "finished";

                const borderColor = isLive
                  ? "rgba(235,126,34,.95)"
                  : isUpcoming
                    ? "rgba(54,212,255,.45)"
                    : "rgba(52,71,151,.9)";

                const bg = isFinished ? "var(--card-soft)" : "var(--card)";

                return (
                  <div
                    key={m.id}
                    className="card"
                    style={{
                      border: `2px solid ${borderColor}`,
                      background: bg,
                      borderRadius: "var(--radius)",
                      boxShadow: "var(--shadow)",
                      padding: 18,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 900,
                              letterSpacing: ".06em",
                              background: isLive
                                ? "var(--orange-cuivre)"
                                : isUpcoming
                                  ? "var(--bleu-futur)"
                                  : "var(--bleu-cyber)",
                              color: isLive || isUpcoming ? "var(--bleu-absolu)" : "var(--blanc-lunaire)",
                            }}
                          >
                            {isLive && "🔴 EN DIRECT"}
                            {isUpcoming && "À VENIR"}
                            {isFinished && "TERMINÉ"}
                          </span>

                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 800,
                              border: "1px solid rgba(54,212,255,.55)",
                              color: "var(--bleu-futur)",
                            }}
                          >
                            {m.tournament || "Match"}
                          </span>
                        </div>

                        <div style={{ fontSize: 22, fontWeight: 900 }}>
                          {m.team_a_name} <span style={{ color: "var(--orange-cuivre)" }}>vs</span> {m.team_b_name}
                        </div>

                        <div className="p-sub" style={{ marginTop: 8 }}>
                          {formatDateFR(m.date)} · <strong>{formatTimeFR(m.date)}</strong>
                        </div>

                        <div className="p-sub" style={{ marginTop: 6 }}>
                          Lieu : <strong>{m.location || "Online"}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {isLive && m.live_url ? (
                          <a className="btn btn-primary" href={m.live_url} target="_blank" rel="noreferrer">
                            Regarder le live →
                          </a>
                        ) : null}

                        {isFinished && m.replay_url ? (
                          <a className="btn btn-outline" href={m.replay_url} target="_blank" rel="noreferrer">
                            Voir le replay →
                          </a>
                        ) : null}
                      </div>
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
