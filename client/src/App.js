import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.js';
import Home from './pages/Home.js';
import Rooms from './pages/Rooms.js';
import RoomDetails from './pages/RoomDetails.js';
import TableBooking from './pages/TableBooking.js';
import Login from './pages/Login.js';
import MyBookings from './pages/MyBookings.js';
import AdminDashboard from './pages/AdminDashboard.js';
import { getUser } from './auth.js';

function RequireAuth({ children, roles }) {
  const u = getUser();
  if (!u) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(u.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/tables" element={<TableBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my" element={<RequireAuth><MyBookings /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth roles={['admin']}><AdminDashboard /></RequireAuth>} />
      </Routes>
    </>
  );
}
