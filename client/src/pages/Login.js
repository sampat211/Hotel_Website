import React from 'react';
import api from '../api.js';
import { setToken, setUser } from '../auth.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [signup, setSignup] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  const submit = () => {
    setMsg('');
    const path = signup ? '/auth/register' : '/auth/login';
    const body = signup ? { email, password, name } : { email, password };

    api.post(path, body)
      .then(r => {
        setToken(r.data.token);
        setUser(r.data.user);
        nav('/');
      })
      .catch(e => setMsg(e.response?.data?.error || 'Error'));
  };

  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "75vh",
      padding: "24px",
      background: "#fafafa",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      background: "#ffffff",
      padding: "32px",
      borderRadius: "12px",
      border: "1px solid #e5e5e5",
      boxShadow: "0px 4px 14px rgba(0,0,0,0.10)"
    },
    title: {
      fontSize: "1.9rem",
      fontWeight: 700,
      textAlign: "center",
      marginBottom: "24px",
      color: "#222"
    },
    input: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "1rem",
    },
    btnPrimary: {
      width: "100%",
      marginTop: "12px",
      padding: "12px",
      background: "#e87a24",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: ".25s"
    },
    btnPrimaryHover: {
      background: "#c26217"
    },
    toggleBtn: {
      width: "100%",
      marginTop: "10px",
      padding: "12px",
      border: "2px solid #e87a24",
      background: "transparent",
      color: "#e87a24",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: ".25s"
    },
    toggleBtnHover: {
      background: "#e87a24",
      color: "#fff"
    },
    msg: {
      marginTop: "16px",
      textAlign: "center",
      padding: "10px",
      background: "#f1f1f1",
      borderRadius: "8px",
      color: "#444"
    }
  };

  const [hoverLogin, setHoverLogin] = React.useState(false);
  const [hoverToggle, setHoverToggle] = React.useState(false);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <h2 style={styles.title}>{signup ? "Create Account" : "Login"}</h2>

        {signup && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={submit}
          style={{
            ...styles.btnPrimary,
            ...(hoverLogin ? styles.btnPrimaryHover : {})
          }}
          onMouseEnter={() => setHoverLogin(true)}
          onMouseLeave={() => setHoverLogin(false)}
        >
          {signup ? "Create Account" : "Login"}
        </button>

        <button
          onClick={() => setSignup(!signup)}
          style={{
            ...styles.toggleBtn,
            ...(hoverToggle ? styles.toggleBtnHover : {})
          }}
          onMouseEnter={() => setHoverToggle(true)}
          onMouseLeave={() => setHoverToggle(false)}
        >
          {signup ? "Already have account? Login" : "New user? Sign Up"}
        </button>

        {msg && <div style={styles.msg}>{msg}</div>}

      </div>
    </div>
  );
}
