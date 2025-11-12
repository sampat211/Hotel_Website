import React from 'react';
import api from '../api.js';

export default function TableBooking() {
  const [tables, setTables] = React.useState([]);
  const [date, setDate] = React.useState('');
  const [slot, setSlot] = React.useState('19:00');
  const [selected, setSelected] = React.useState('');
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    api.get('/tables').then(r => setTables(r.data));
  }, []);

  const reserve = () => {
    setMsg('');
    api
      .post('/tables/' + selected + '/reserve', { date, timeSlot: slot })
      .then(r => setMsg('✅ Reserved! Booking ID: ' + r.data.id))
      .catch(e => setMsg(e.response?.data?.error || 'Error'));
  };

  const styles = {
    wrapper: {
      padding: "32px",
      maxWidth: "600px",
      margin: "0 auto",
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "24px",
      color: "#222",
      textAlign: "center",
    },
    card: {
      background: "#fff",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #eee",
      boxShadow: "0px 2px 10px rgba(0,0,0,0.08)"
    },
    row: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginTop: "16px"
    },
    select: {
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "1rem",
      cursor: "pointer"
    },
    input: {
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "1rem",
    },
    btn: {
      padding: "12px",
      background: "#e87a24",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      fontSize: "1rem",
      cursor: "pointer",
      transition: ".25s"
    },
    btnDisabled: {
      opacity: 0.5,
      cursor: "not-allowed"
    },
    btnHover: {
      background: "#c26318"
    },
    msg: {
      marginTop: "16px",
      padding: "12px",
      borderRadius: "8px",
      background: "#f3f3f3",
      textAlign: "center",
      color: "#444"
    }
  };

  const [hoverBtn, setHoverBtn] = React.useState(false);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Reserve a Restaurant Table</h2>

      <div style={styles.card}>
        <div style={styles.row}>

          {/* Table Select */}
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={styles.select}
          >
            <option value="">Select table</option>
            {tables.map(t => (
              <option key={t.id} value={t.id}>
                Table {t.tableNumber} • {t.capacity} people
              </option>
            ))}
          </select>

          {/* Date input */}
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={styles.input}
          />

          {/* Time Slot */}
          <select
            value={slot}
            onChange={e => setSlot(e.target.value)}
            style={styles.select}
          >
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
          </select>

          {/* Submit */}
          <button
            onClick={reserve}
            disabled={!selected || !date}
            style={{
              ...styles.btn,
              ...(hoverBtn ? styles.btnHover : {}),
              ...(!selected || !date ? styles.btnDisabled : {}),
            }}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
          >
            Reserve
          </button>
        </div>

        {msg && <div style={styles.msg}>{msg}</div>}
      </div>
    </div>
  );
}
