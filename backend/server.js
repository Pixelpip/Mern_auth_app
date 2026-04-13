
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth');
const { getStats } = require('./controllers/itemController');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/api/stats', protect, getStats);


app.get('/', (req, res) => {
  res.json({ message: 'MERN Auth API is running' });
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
