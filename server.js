require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Initialize app
const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());

// Connect DB
connectDB();

// Seed Admin
async function seedAdmin() {
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const pass = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !pass) return;

    const existing = await Admin.findOne({ email });
    if (!existing) {
      const hashed = await bcrypt.hash(pass, 10);
      await Admin.create({ email, password: hashed });
      console.log('✅ Admin seeded:', email);
    }
  } catch (e) {
    console.error('❌ Seed admin error:', e.message);
  }
}
seedAdmin();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/events', require('./routes/events'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 API listening on port ${port}`));
