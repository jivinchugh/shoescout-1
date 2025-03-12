// src/server.js
require('dotenv').config(); // Load environment variables

// We want to gracefully shutdown our server
const stoppable = require('stoppable');

// Get our logger instance
const logger = require('./logger');

// Get our express app instance
const app = require('./app');

const mongoose = require('mongoose');

// Get the desired port from the process' environment. Default to `8080`
const port = parseInt(process.env.PORT || '8080', 10);
const mongoURI = process.env.MONGO_URI;

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error('MongoDB Connection Error:', error);
    process.exit(1); // Exit process on failure
  }
};

// Start the server
connectDB().then(() => {
  const server = stoppable(
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    })
  );

  // Gracefully shutdown the server
  process.on('SIGINT', async () => {
    logger.info('Gracefully shutting down...');
    await mongoose.connection.close();
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
});
