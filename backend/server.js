// server.js - Express application entry point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth');
const { getStats } = require('./controllers/itemController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Stats route (as per assignment spec: GET /api/stats)
app.get('/api/stats', protect, getStats);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Auth API is running' });
});

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
