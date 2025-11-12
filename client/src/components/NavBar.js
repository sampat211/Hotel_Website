import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../auth.js';

export default function NavBar(){
  const nav = useNavigate();
  const [user, setUser] = React.useState(() => getUser());

  React.useEffect(() => {
    const i = setInterval(() => setUser(getUser()), 500);
    return () => clearInterval(i);
  }, []);

  const onLogout = () => {
    logout();
    setUser(null);
    nav('/login');
  };

  const styles = {
    nav: {
      display: "flex",
      alignItems: "center",
      gap: "28px",
      padding: "14px 28px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      background: "#ffffff",
      position: "sticky",
      top: 0,
      zIndex: 999
    },
    brand: {
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "#e87a24",
      textDecoration: "none",
      marginRight: "12px"
    },
    link: {
      textDecoration: "none",
      fontWeight: 500,
      fontSize: "1rem",
      padding: "8px 10px",
      borderRadius: "6px",
      color: "#444",
      transition: "0.25s"
    },
    linkHover: {
      background: "#f2f2f2"
    },
    rightSection: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
    },
    logoutBtn: {
      background: "#e74c3c",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: 500,
      transition: "0.25s"
    },
    logoutHover: {
      background: "#c0392b"
    },
    loginBtn: {
      color: "#fff",
      background: "#3498db",
      padding: "8px 14px",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: 500,
      transition: "0.25s"
    },
    loginHover: {
      background: "#267bba"
    }
  };

  const [hover, setHover] = React.useState({
    rooms: false,
    restaurant: false,
    my: false,
    admin: false,
    logout: false,
    login: false
  });

  // Reusable link style builder
  const buildLinkStyle = key => ({
    ...styles.link,
    ...(hover[key] ? styles.linkHover : {})
  });

  return (
    <nav style={styles.nav}>
      
      <Link to="/" style={styles.brand}>HotelStay+</Link>

      <Link
        to="/rooms"
        style={buildLinkStyle("rooms")}
        onMouseEnter={() => setHover(h => ({ ...h, rooms: true }))}
        onMouseLeave={() => setHover(h => ({ ...h, rooms: false }))}
      >
        Rooms
      </Link>

      <Link
        to="/tables"
        style={buildLinkStyle("restaurant")}
        onMouseEnter={() => setHover(h => ({ ...h, restaurant: true }))}
        onMouseLeave={() => setHover(h => ({ ...h, restaurant: false }))}
      >
        Restaurant
      </Link>

      {user && (
        <Link
          to="/my"
          style={buildLinkStyle("my")}
          onMouseEnter={() => setHover(h => ({ ...h, my: true }))}
          onMouseLeave={() => setHover(h => ({ ...h, my: false }))}
        >
          My Bookings
        </Link>
      )}

      {user && user.role === 'admin' && (
        <Link
          to="/admin"
          style={buildLinkStyle("admin")}
          onMouseEnter={() => setHover(h => ({ ...h, admin: true }))}
          onMouseLeave={() => setHover(h => ({ ...h, admin: false }))}
        >
          Admin
        </Link>
      )}

      <div style={styles.rightSection}>
        {user ? (
          <button
            onClick={onLogout}
            style={{
              ...styles.logoutBtn,
              ...(hover.logout ? styles.logoutHover : {})
            }}
            onMouseEnter={() => setHover(h => ({ ...h, logout: true }))}
            onMouseLeave={() => setHover(h => ({ ...h, logout: false }))}
          >
            Logout ({user.name})
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              ...styles.loginBtn,
              ...(hover.login ? styles.loginHover : {})
            }}
            onMouseEnter={() => setHover(h => ({ ...h, login: true }))}
            onMouseLeave={() => setHover(h => ({ ...h, login: false }))}
          >
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
}
