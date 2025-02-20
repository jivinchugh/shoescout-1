// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createUser, getUser } = require('./models/user');

// author and version from our package.json file
// TODO: make sure you have updated your name in the `author` section
const { author, version } = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Use express middleware to parse JSON bodies
app.use(express.json());

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
app.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: 'ok',
    author,
    // TODO: change this to use your GitHub username!
    githubUrl: 'https://github.com/CAPSTONE-2025/Group_11',
    version,
  });
});

app.post('/users', async (req, res) => {
  const { username, shoeSize } = req.body;
  try {
    const user = await createUser(username, shoeSize);
    res.status(201).json(user);
  } catch (err) {
    logger.error('Error creating user', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUser(username);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    logger.error('Error fetching user', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // We may already have an error response we can use, but if not,
  // use a generic `500` server error and message.
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = app;