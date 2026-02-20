// Load environment variables
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

// Connect to the Database
// This ensures we don't start the server if the DB is down
connectDB(process.env.MONGO_URI);

// Set the Port
const PORT = process.env.PORT || 5000;

console.log('Environment Variables Loaded:', process.env.NODE_ENV);
console.log(`mongodB URL: ${process.env.MONGO_URI}`);

// Start the Server
const server = app.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 FeedbackFlow API is LIVE
    🌍 Mode: ${process.env.NODE_ENV || 'development'}
    📍 Port: ${PORT}
    =========================================
    `);
});

// Global "Kill Switch" for Unhandled Errors
// If a database connection fails or an async error isn't caught,
// this prevents the app from hanging in a "zombie" state.
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Error: ${err.message}`);
    // Shut down the server gracefully
    server.close(() => process.exit(1));
});