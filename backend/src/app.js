const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { errorHandler } = require('./middlewares/errorHandler');
const searchRoutes = require('./routes/searches');
const providerRoutes = require('./routes/providers');
const routeRoutes = require('./routes/routes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// API routes
app.use('/api/v1/searches', searchRoutes);
app.use('/api/v1/providers', providerRoutes);
app.use('/api/v1/routes', routeRoutes);

// root
app.get('/', (req, res) => {
  res.json({ message: 'Flight Meta Searcher API running 🚀' });
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));