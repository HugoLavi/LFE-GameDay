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
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const [allRes, upcomingRes] = await Promise.all([
          api.get("events/"),
          api.get("events/upcoming/"),
        ]);
        setEvents(allRes.data);
        setUpcoming(upcomingRes.data);
      } catch (err) {
        console.error("Erreur fetch événements", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div>
      <h1 className="page-title">Événements</h1>
      <p className="page-subtitle">
        Agenda complet des événements eSport.
      </p>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Événements totaux</span>
          </div>
          <div className="card-value">{loading ? "…" : events.length}</div>
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
          <span className="card-title">Prochains événements</span>
        </div>
        {loading ? (
          <p>Chargement…</p>
        ) : upcoming.length === 0 ? (
          <p>Aucun événement à venir.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Titre</th>
                <th>Lieu</th>
                <th>Participants</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className="tag tag-upcoming">
                      {formatDate(e.date)}
                    </span>
                  </td>
                  <td>{e.title}</td>
                  <td>{e.location || "En ligne"}</td>
                  <td>{e.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-header">
          <span className="card-title">Tous les événements</span>
        </div>
        {loading ? (
          <p>Chargement…</p>
        ) : events.length === 0 ? (
          <p>Aucun événement enregistré.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Titre</th>
                <th>Lieu</th>
                <th>Participants</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  <td>{e.title}</td>
                  <td>{e.location || "En ligne"}</td>
                  <td>{e.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
