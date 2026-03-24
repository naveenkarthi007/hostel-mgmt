require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API routes
app.use('/api', routes);

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Hostel Management Server running on http://localhost:${PORT}`);
  });
});
