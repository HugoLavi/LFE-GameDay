// src/pages/TeamDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [teamRes, playersRes, matchesRes] = await Promise.all([
          api.get(`teams/${id}/`),
          api.get(`players/?team=${id}`),
          api.get(`matches/?team=${id}`),
        ]);
        setTeam(teamRes.data);
        setPlayers(playersRes.data);
        setMatches(matchesRes.data);
      } catch (err) {
        console.error("Erreur fetch team detail", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  if (loading && !team) return <p>Chargement…</p>;
  if (!team) return <p>Équipe introuvable.</p>;

  return (
    <div>
      <h1 className="page-title">{team.name}</h1>
      <p className="page-subtitle">
        Jeu : <strong>{team.game}</strong>
      </p>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Joueurs</span>
          </div>
          <div className="card-value">{players.length}</div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Matchs</span>
          </div>
          <div className="card-value">{matches.length}</div>
        </div>
      </div>

      {team.description && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <span className="card-title">Description</span>
          </div>
          <p style={{ fontSize: 14 }}>{team.description}</p>
        </div>
      )}

      <div className="grid-3">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Joueurs</span>
          </div>
          {players.length === 0 ? (
            <p>Aucun joueur assigné.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Pseudo</th>
                  <th>Rôle club</th>
                  <th>Rôle LoL</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id}>
                    <td>{p.pseudo}</td>
                    <td>
                      <span className="tag tag-role">{p.club_role}</span>
                    </td>
                    <td>{p.game_role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <span className="card-title">Matchs de l’équipe</span>
            <Link to="/matches" className="link">
              Voir tous les matchs
            </Link>
          </div>
          {matches.length === 0 ? (
            <p>Aucun match lié à cette équipe.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Affiche</th>
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
                    <td>{m.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
