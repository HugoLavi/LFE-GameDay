import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { api } from "../api/client";

export default function Equipes() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("events/");
        setEvents(res.data);
      } catch (e) {
        console.error("Erreur Événements", e);
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
          <h1 className="h1">Événements eSport</h1>
          <p className="p-sub">Découvrez le calendrier des prochains événements et participez à la compétition.</p>

          {loading ? (
            <p className="p-sub" style={{ marginTop: 16 }}>
              Chargement...
            </p>
          ) : events.length === 0 ? (
            <p className="p-sub" style={{ marginTop: 16 }}>
              Aucun événement enregistré.
            </p>
          ) : (
            <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
              {events.map((event) => (
                <div key={event.id} className="card card-pad">
                  {event.image_url ? <img src={event.image_url} alt={event.title} className="event-card-image" /> : null}
                  <h2 className="card-title">{event.title}</h2>
                  <p className="p-sub" style={{ marginBottom: 10 }}>{event.description || "Description à venir"}</p>
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <span>Date</span>
                      {formatDateFR(event.date)}
                    </div>
                    <div className="event-meta-item">
                      <span>Heure</span>
                      {formatTimeFR(event.date)}
                    </div>
                    <div className="event-meta-item">
                      <span>Participants</span>
                      {event.participants}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
