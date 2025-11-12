const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { hashSync, compareSync } = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'dev_secret_change_me';

let users = [
  { id: 'u1', name: 'Admin', email: 'admin@hotel.com', passwordHash: hashSync('Admin@123', 8), role: 'admin', phone: '9999999999' }
];
let rooms = [
  { id: 'r1', name: 'Deluxe Sea View', type: 'Deluxe', description: 'Sea view, king bed', price: 120, images: [], capacity: 2, amenities: ['WiFi','AC','TV'] },
  { id: 'r2', name: 'Standard City', type: 'Standard', description: 'City view, queen bed', price: 80, images: [], capacity: 2, amenities: ['WiFi','AC'] },
  { id: 'r3', name: 'Single Sea View', type: 'Single', description: 'Sea view, king bed', price: 120, images: [], capacity: 2, amenities: ['WiFi','AC','TV'] },
  { id: 'r4', name: 'Deluxe Forest View', type: 'Deluxe', description: 'Forest view, king bed', price: 120, images: [], capacity: 2, amenities: ['WiFi','AC','TV'] },
  { id: 'r5', name: 'Waterfall View', type: 'Deluxe', description: 'Waterfall view, king bed', price: 120, images: [], capacity: 2, amenities: ['WiFi','AC','TV'] },

];
let tables = [
  { id: 't1', tableNumber: 1, capacity: 2, location: 'Window' },
  { id: 't2', tableNumber: 2, capacity: 4, location: 'Center' }
];
let roomBookings = [];
let tableReservations = [];

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}
function authRequired(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid/expired token' });
  }
}
function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin only' });
}

// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already exists' });
  const user = {
    id: 'u' + (users.length + 1),
    name, email,
    passwordHash: hashSync(password, 8),
    phone: phone || '',
    role: 'customer'
  };
  users.push(user);
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email);
  if (!user || !compareSync(password || '', user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
app.get('/api/auth/me', authRequired, (req, res) => {
  const u = users.find(x => x.id === req.user.id);
  res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role } });
});

// Rooms
app.get('/api/rooms', (req, res) => {
  const { type, minPrice, maxPrice, capacity } = req.query;
  let list = rooms.slice();
  if (type) list = list.filter(r => r.type.toLowerCase() === String(type).toLowerCase());
  if (capacity) list = list.filter(r => r.capacity >= Number(capacity));
  if (minPrice) list = list.filter(r => r.price >= Number(minPrice));
  if (maxPrice) list = list.filter(r => r.price <= Number(maxPrice));
  res.json(list);
});
app.get('/api/rooms/:id', (req, res) => {
  const r = rooms.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Room not found' });
  res.json(r);
});
app.post('/api/rooms', authRequired, adminOnly, (req, res) => {
  const { name, type, description, price, capacity, amenities } = req.body || {};
  const r = {
    id: 'r' + (rooms.length + 1),
    name, type, description,
    price: Number(price || 0),
    images: [],
    capacity: Number(capacity || 1),
    amenities: Array.isArray(amenities) ? amenities : []
  };
  rooms.push(r);
  res.status(201).json(r);
});
app.put('/api/rooms/:id', authRequired, adminOnly, (req, res) => {
  const idx = rooms.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });
  rooms[idx] = { ...rooms[idx], ...req.body };
  res.json(rooms[idx]);
});
app.delete('/api/rooms/:id', authRequired, adminOnly, (req, res) => {
  const idx = rooms.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });
  const [removed] = rooms.splice(idx, 1);
  res.json(removed);
});

// Room bookings
app.post('/api/rooms/:id/book', authRequired, (req, res) => {
  const { fromDate, toDate } = req.body || {};
  const room = rooms.find(x => x.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const overlap = roomBookings.some(b =>
    b.roomId === room.id &&
    !(new Date(toDate) <= new Date(b.fromDate) || new Date(fromDate) >= new Date(b.toDate))
  );
  if (overlap) return res.status(409).json({ error: 'Room not available in that range' });

  const nights = Math.max(1, Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000*60*60*24)));
  const booking = {
    id: 'b' + (roomBookings.length + 1),
    userId: req.user.id,
    roomId: room.id,
    fromDate,
    toDate,
    amount: room.price * nights,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  roomBookings.push(booking);
  res.status(201).json(booking);
});
app.get('/api/bookings/my', authRequired, (req, res) => {
  res.json(roomBookings.filter(b => b.userId === req.user.id));
});
app.delete('/api/bookings/:id', authRequired, (req, res) => {
  const idx = roomBookings.findIndex(b => b.id === req.params.id && b.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  roomBookings[idx].status = 'cancelled';
  res.json(roomBookings[idx]);
});

// Tables
app.get('/api/tables', (req, res) => res.json(tables));
app.post('/api/tables', authRequired, adminOnly, (req, res) => {
  const { tableNumber, capacity, location } = req.body || {};
  const t = { id: 't' + (tables.length + 1), tableNumber, capacity, location };
  tables.push(t);
  res.status(201).json(t);
});
app.put('/api/tables/:id', authRequired, adminOnly, (req, res) => {
  const idx = tables.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Table not found' });
  tables[idx] = { ...tables[idx], ...req.body };
  res.json(tables[idx]);
});
app.delete('/api/tables/:id', authRequired, adminOnly, (req, res) => {
  const idx = tables.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Table not found' });
  const [removed] = tables.splice(idx, 1);
  res.json(removed);
});

// Table reservations
app.post('/api/tables/:id/reserve', authRequired, (req, res) => {
  const { date, timeSlot } = req.body || {};
  const table = tables.find(t => t.id === req.params.id);
  if (!table) return res.status(404).json({ error: 'Table not found' });
  const exists = tableReservations.some(r =>
    r.tableId === table.id && r.date === date && r.timeSlot === timeSlot && r.status === 'confirmed'
  );
  if (exists) return res.status(409).json({ error: 'Slot already reserved' });

  const reservation = {
    id: 'tr' + (tableReservations.length + 1),
    userId: req.user.id,
    tableId: table.id,
    date,
    timeSlot,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  tableReservations.push(reservation);
  res.status(201).json(reservation);
});
app.get('/api/reservations/my', authRequired, (req, res) => {
  res.json(tableReservations.filter(r => r.userId === req.user.id));
});
app.delete('/api/reservations/:id', authRequired, (req, res) => {
  const idx = tableReservations.findIndex(r => r.id === req.params.id && r.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Reservation not found' });
  tableReservations[idx].status = 'cancelled';
  res.json(tableReservations[idx]);
});

// Admin overview
app.get('/api/admin/overview', authRequired, adminOnly, (req, res) => {
  res.json({
    users: users.length,
    rooms: rooms.length,
    tables: tables.length,
    roomBookings: roomBookings.length,
    tableReservations: tableReservations.length
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('API running on http://localhost:' + PORT));
