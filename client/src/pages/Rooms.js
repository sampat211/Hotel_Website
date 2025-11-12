import React from 'react';
import api from '../api.js';
import { Link } from 'react-router-dom';
import img1 from '../images/1.jpg';
import img2 from '../images/2.jpg';
import img3 from '../images/3.jpg';
import img4 from '../images/4.jpg';

export default function Rooms() {
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [hoverCard, setHoverCard] = React.useState(null);
  const [hoverBtn, setHoverBtn] = React.useState(null);

  React.useEffect(() => {
    api.get('/rooms')
      .then(res => setList(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Fallback hotel images
const sampleImages = [img1, img2, img3, img4];


  const styles = {
    wrapper: {
      padding: "32px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    heading: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "24px",
      color: "#222",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px",
    },
    card: {
      background: "#fff",
      borderRadius: "12px",
      padding: "18px",
      border: "1px solid #eee",
      boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
      transition: "0.25s",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0px 6px 16px rgba(0,0,0,0.15)"
    },
    img: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "12px"
    },
    title: {
      fontSize: "1.3rem",
      fontWeight: 600,
      marginBottom: "8px",
      color: "#333"
    },
    desc: {
      fontSize: "0.95rem",
      color: "#666",
      marginBottom: "6px"
    },
    price: {
      marginTop: "8px",
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#e87a24"
    },
    btn: {
      marginTop: "16px",
      textAlign: "center",
      padding: "10px 14px",
      background: "#3498db",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "6px",
      fontWeight: 500,
      transition: "0.25s",
      cursor: "pointer"
    },
    btnHover: {
      background: "#216fad"
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontSize: "1.25rem",
          color: "#666"
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Available Rooms</h2>

      <div style={styles.grid}>
        {list.map((room, i) => {
          const isCardHover = hoverCard === room.id;
          const isBtnHover = hoverBtn === room.id;

          const imageUrl =
            room.images?.[0] || // if backend supplies images
            sampleImages[i % sampleImages.length]; // fallback sample image

          return (
            <div
              key={room.id}
              style={{
                ...styles.card,
                ...(isCardHover ? styles.cardHover : {})
              }}
              onMouseEnter={() => setHoverCard(room.id)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <img src={imageUrl} alt={room.name} style={styles.img} />

              <h4 style={styles.title}>{room.name}</h4>

              <div style={styles.desc}>
                {room.type} • Capacity {room.capacity}
              </div>

              <div style={styles.price}>${room.price} / night</div>

              <Link
                to={`/rooms/${room.id}`}
                style={{
                  ...styles.btn,
                  ...(isBtnHover ? styles.btnHover : {})
                }}
                onMouseEnter={() => setHoverBtn(room.id)}
                onMouseLeave={() => setHoverBtn(null)}
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
