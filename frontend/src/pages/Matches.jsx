// src/pages/Matches.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resultLabel(result) {
  switch (result) {
    case "A":
      return "Victoire équipe A";
    case "B":
      return "Victoire équipe B";
    case "D":
      return "Match nul";
    case "P":
      return "À jouer";
    default:
      return result;
  }
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const [allRes, upcomingRes] = await Promise.all([
          api.get("matches/"),
          api.get("matches/upcoming/"),
        ]);
        setMatches(allRes.data);
        setUpcoming(upcomingRes.data);
      } catch (err) {
        console.error("Erreur fetch matches", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  return (
    <div>
      <h1 className="page-title">Matchs</h1>
      <p className="page-subtitle">
        Planning global des rencontres de l’association.
      </p>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Matchs totaux</span>
          </div>
          <div className="card-value">{loading ? "…" : matches.length}</div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">À venir</span>
          </div>
          <div className="card-value">
            {loading ? "…" : upcoming.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Prochains matchs</span>
        </div>
        {loading ? (
          <p>Chargement…</p>
        ) : upcoming.length === 0 ? (
          <p>Aucun match à venir.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Affiche</th>
                <th>Tournoi</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="tag tag-upcoming">
                      {formatDate(m.date)}
                    </span>
                  </td>
                  <td>
                    {m.team_a_name} vs {m.team_b_name}
                  </td>
                  <td>{m.tournament || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-header">
          <span className="card-title">Tous les matchs</span>
        </div>
        {loading ? (
          <p>Chargement…</p>
        ) : matches.length === 0 ? (
          <p>Aucun match enregistré.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Affiche</th>
                <th>Tournoi</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id}>
                  <td>{formatDate(m.date)}</td>
                  <td>
                    {m.team_a_name} vs {m.team_b_name}
                  </td>
                  <td>{m.tournament || "—"}</td>
                  <td>
                    <span
                      className={
                        "tag " +
                        (m.result === "P"
                          ? "tag-upcoming"
                          : "tag-finished")
                      }
                    >
                      {resultLabel(m.result)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
