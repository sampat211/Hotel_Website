import React from 'react';
import api from '../api.js';

export default function MyBookings() {
  const [room, setRoom] = React.useState([]);
  const [table, setTable] = React.useState([]);

  React.useEffect(() => {
    api.get('/bookings/my').then(r => setRoom(r.data));
    api.get('/reservations/my').then(r => setTable(r.data));
  }, []);

  const styles = {
    wrapper: {
      padding: "32px",
      maxWidth: "900px",
      margin: "0 auto",
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#222",
      marginBottom: "24px",
      textAlign: "center",
    },
    section: {
      marginTop: "24px"
    },
    sectionTitle: {
      fontSize: "1.4rem",
      fontWeight: 600,
      color: "#444",
      marginBottom: "12px",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    card: {
      padding: "18px",
      border: "1px solid #eee",
      borderRadius: "12px",
      background: "#fff",
      boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
      transition: "0.25s",
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
    },
    label: {
      fontWeight: 600,
      marginRight: "4px"
    },
    status: {
      marginTop: "6px",
      fontWeight: 600,
      textTransform: "capitalize"
    }
  };

  const [hover, setHover] = React.useState(null);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>My Bookings</h2>

      {/* Rooms */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Room Bookings</h3>

        {room.length === 0 ? (
          <p>No room bookings yet.</p>
        ) : (
          <div style={styles.list}>
            {room.map(b => {
              const isHover = hover === b.id;
              return (
                <div
                  key={b.id}
                  style={{
                    ...styles.card,
                    ...(isHover ? styles.cardHover : {})
                  }}
                  onMouseEnter={() => setHover(b.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div>
                    <span style={styles.label}>Booking ID:</span> {b.id}
                  </div>

                  <div>
                    <span style={styles.label}>From:</span> {b.fromDate}
                  </div>

                  <div>
                    <span style={styles.label}>To:</span> {b.toDate}
                  </div>

                  <div>
                    <span style={styles.label}>Amount:</span> ${b.amount}
                  </div>

                  <div style={{
                    ...styles.status,
                    color: b.status === "confirmed" ? "green" : "#b30000"
                  }}>
                    {b.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Restaurant */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Restaurant Reservations</h3>

        {table.length === 0 ? (
          <p>No table bookings yet.</p>
        ) : (
          <div style={styles.list}>
            {table.map(t => {
              const isHover = hover === t.id;
              return (
                <div
                  key={t.id}
                  style={{
                    ...styles.card,
                    ...(isHover ? styles.cardHover : {})
                  }}
                  onMouseEnter={() => setHover(t.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div>
                    <span style={styles.label}>Reservation ID:</span> {t.id}
                  </div>

                  <div>
                    <span style={styles.label}>Date:</span> {t.date}
                  </div>

                  <div>
                    <span style={styles.label}>Time:</span> {t.timeSlot}
                  </div>

                  <div style={{
                    ...styles.status,
                    color: t.status === "confirmed" ? "green" : "#b30000"
                  }}>
                    {t.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
