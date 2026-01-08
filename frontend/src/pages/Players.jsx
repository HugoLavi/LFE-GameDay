// src/pages/Players.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await api.get("players/");
        setPlayers(res.data);
      } catch (err) {
        console.error("Erreur fetch players", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  return (
    <div>
      <h1 className="page-title">Joueurs</h1>
      <p className="page-subtitle">
        Liste des joueurs, coachs et arbitres enregistrés.
      </p>

      <div className="card">
        {loading ? (
          <p>Chargement des joueurs…</p>
        ) : players.length === 0 ? (
          <p>Aucun joueur pour l’instant.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Pseudo</th>
                <th>Équipe</th>
                <th>Rôle club</th>
                <th>Rôle LoL</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td>{p.pseudo}</td>
                  <td>{p.team_name}</td>
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
    </div>
  );
}
