import React from 'react';
import api from '../api.js';

export default function AdminDashboard() {
  const [info, setInfo] = React.useState(null);

  React.useEffect(() => {
    api.get('/admin/overview')
      .then(r => setInfo(r.data))
      .catch(() => setInfo(null));
  }, []);

  const styles = {
    wrapper: {
      padding: "32px",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#222",
      marginBottom: "24px",
      textAlign: "center"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
    },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #eee",
      boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
      transition: ".25s",
      textAlign: "center",
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
    },
    label: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#777",
      marginBottom: "8px"
    },
    value: {
      fontSize: "1.8rem",
      fontWeight: 700,
      color: "#e87a24"
    }
  };

  const [hover, setHover] = React.useState(null);

  if (!info) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "1.25rem", color: "#666" }}>
        Loading...
      </div>
    );
  }

  const stats = [
    { key: "users", label: "Total Users", value: info.users },
    { key: "rooms", label: "Rooms", value: info.rooms },
    { key: "tables", label: "Tables", value: info.tables },
    { key: "roomBookings", label: "Room Bookings", value: info.roomBookings },
    { key: "tableReservations", label: "Table Reservations", value: info.tableReservations },
  ];

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Admin Dashboard</h2>

      <div style={styles.grid}>
        {stats.map(item => {
          const isHover = hover === item.key;

          return (
            <div
              key={item.key}
              style={{
                ...styles.card,
                ...(isHover ? styles.cardHover : {})
              }}
              onMouseEnter={() => setHover(item.key)}
              onMouseLeave={() => setHover(null)}
            >
              <div style={styles.label}>{item.label}</div>
              <div style={styles.value}>{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
