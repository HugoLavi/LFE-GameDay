import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { api } from "../api/client";

function roleLabel(role) {
  const map = { top: "Top", jungle: "Jungle", mid: "Mid", adc: "ADC", support: "Support" };
  return map[role] ?? role;
}

export default function Equipes() {
  const [teams, setTeams] = useState([]);
  const [rosters, setRosters] = useState({}); // { [teamId]: Player[] }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const teamsRes = await api.get("teams/");
        setTeams(teamsRes.data);

        const rosterPairs = await Promise.all(
          teamsRes.data.map(async (t) => {
            const playersRes = await api.get(`players/?team=${t.id}`);
            return [t.id, playersRes.data];
          })
        );

        setRosters(Object.fromEntries(rosterPairs));
      } catch (e) {
        console.error("Erreur Equipes", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <div className="page">
      <Navigation />

      <section className="section">
        <div className="container">
          <h1 className="h1">Nos équipes</h1>
          <p className="p-sub">Découvrez nos équipes compétitives et leurs rosters.</p>

          {loading ? (
            <p className="p-sub" style={{ marginTop: 16 }}>
              Chargement...
            </p>
          ) : teams.length === 0 ? (
            <p className="p-sub" style={{ marginTop: 16 }}>
              Aucune équipe enregistrée.
            </p>
          ) : (
            <div style={{ marginTop: 20 }} className="grid gap-8">
              {teams.map((team) => {
                const players = rosters[team.id] || [];
                const color = team.color || "#36d4ff";
                const total = (team.wins ?? 0) + (team.losses ?? 0);
                const wr = team.winrate ?? (total ? Math.round((team.wins / total) * 100) : 0);

                return (
                  <div key={team.id} className="card card-pad">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                      <div>
                        <h2 style={{ margin: 0, color, fontSize: 28, fontWeight: 900, letterSpacing: ".06em" }}>
                          {team.name}
                        </h2>
                        <p className="p-sub" style={{ marginTop: 6 }}>
                          <strong style={{ color: "#36d4ff" }}>{team.game}</strong>
                        </p>

                        {team.description ? (
                          <p className="p-sub" style={{ marginTop: 10, maxWidth: 760 }}>
                            {team.description}
                          </p>
                        ) : null}
                      </div>

                      <div
                        style={{
                          width: 78,
                          height: 78,
                          borderRadius: 999,
                          border: `4px solid ${color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 900,
                          color,
                        }}
                        title="Team badge"
                      >
                        {team.name?.slice(0, 2)?.toUpperCase()}
                      </div>
                    </div>

                    <div style={{ marginTop: 14 }} className="p-sub">
                      Rang : <strong>{team.rank || "—"}</strong> ·{" "}
                      <strong>{team.wins ?? 0}V</strong> / <strong>{team.losses ?? 0}D</strong> ·{" "}
                      WR <strong>{wr}%</strong>
                    </div>

                    <h3 className="card-title" style={{ marginTop: 18 }}>
                      Roster
                    </h3>

                    {players.length === 0 ? (
                      <p className="p-sub">Aucun joueur assigné.</p>
                    ) : (
                      <div
                        style={{
                          marginTop: 10,
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: 12,
                        }}
                      >
                        {players.map((p) => (
                          <div key={p.id} className="card soft card-pad">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 999,
                                  border: `2px solid ${color}`,
                                  color,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 900,
                                  fontSize: 12,
                                }}
                              >
                                {p.pseudo?.slice(0, 2)?.toUpperCase()}
                              </div>

                              <div>
                                <div style={{ fontWeight: 900 }}>{p.pseudo}</div>
                                <div className="p-sub" style={{ margin: 0 }}>
                                  {roleLabel(p.game_role)}
                                </div>
                              </div>
                            </div>

                            <div style={{ marginTop: 10 }} className="p-sub">
                              Rank : <strong style={{ color: "#eb7e22" }}>{p.rank || "—"}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
