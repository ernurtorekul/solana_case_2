const express = require('express');
const cors = require('cors');
require('dotenv').config();

const issuerRoutes = require('./routes/issuer');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/property');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/issuer', issuerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/property', propertyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Solana Citizen Platform API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Network: ${process.env.SOLANA_NETWORK}`);
  console.log(`RPC URL: ${process.env.SOLANA_RPC_URL}`);
});