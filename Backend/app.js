const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import your modular routes
const pgxRoutes = require('./routes/pgxRoutes');

const app = express();

// 2. Middleware
app.use(cors({
    origin: ['http://localhost:5173','https://pharma-guard-eight.vercel.app'], // Matches your frontend port
    methods: ['POST', 'GET', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));
app.use(express.json());

// 3. Integrate Routes (Route Mounting)
// This prefixes all routes inside pgxRoutes with /api/v1
// Example: The endpoint becomes http://localhost:3000/api/v1/analyze
app.use('/api/v1', pgxRoutes);

// 4. Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🧬 PharmaGuard Backend Live
    🚀 Endpoint: http://localhost:${PORT}/api/v1/analyze
    🛠️ Environment: ${process.env.NODE_ENV || 'development'}
    `);
});