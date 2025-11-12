import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = React.useState(null);
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    api.get('/rooms/' + id)
      .then(r => setRoom(r.data))
      .catch(() => setRoom(null));
  }, [id]);

  const book = () => {
    setMsg('');
    api.post('/rooms/' + id + '/book', { fromDate, toDate })
      .then(r => setMsg('✅ Booked! ID: ' + r.data.id + ' | Amount: $' + r.data.amount))
      .catch(e => setMsg(e.response?.data?.error || 'Error'));
  };

  const styles = {
    wrapper: {
      padding: "32px",
      maxWidth: "800px",
      margin: "0 auto",
    },
    card: {
      background: "#fff",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #eee",
      boxShadow: "0px 2px 10px rgba(0,0,0,0.08)"
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#222",
      marginBottom: "12px"
    },
    desc: {
      fontSize: "1rem",
      color: "#666",
      marginBottom: "16px",
      lineHeight: 1.5
    },
    price: {
      fontSize: "1.3rem",
      fontWeight: 600,
      color: "#e87a24",
      marginBottom: "20px"
    },
    row: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "12px"
    },
    input: {
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "1rem",
      flex: "1"
    },
    btn: {
      padding: "12px",
      background: "#3498db",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      fontSize: "1rem",
      cursor: "pointer",
      transition: ".25s"
    },
    btnHover: {
      background: "#216fad"
    },
    msg: {
      marginTop: "16px",
      padding: "12px",
      borderRadius: "8px",
      background: "#f6f6f6",
      textAlign: "center",
      fontWeight: 500,
    }
  };

  const [hoverBtn, setHoverBtn] = React.useState(false);

  if (!room) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "1.25rem", color: "#666" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>{room.name}</h2>

        <div style={styles.desc}>{room.description}</div>

        <div style={styles.price}>${room.price} / night</div>

        {/* Dates + Book */}
        <div style={styles.row}>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            style={styles.input}
          />

          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={book}
            style={{
              ...styles.btn,
              ...(hoverBtn ? styles.btnHover : {})
            }}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
          >
            Book Now
          </button>
        </div>

        {msg && (
          <div style={styles.msg}>
            {msg}
          </div>
        )}

      </div>
    </div>
  );
}
