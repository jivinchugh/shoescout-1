const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createUser, getUser } = require('./models/user');
const axios = require('axios');

// author and version from our package.json file
// TODO: make sure you have updated your name in the author section
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
// we'll respond with a 200 OK. If not, the server isn't healthy.
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

// StockX API endpoint - moved before error handling middleware
app.get('/shoes/:query', async (req, res) => {
  const { query } = req.params;
  
  const formattedQuery = query.replace(/-/g, ' ');

  const options = {
    method: 'GET',
    url: 'https://stockx-api.p.rapidapi.com/search',
    params: {
      query: formattedQuery,
      page: 1
    },
    headers: {
      'Accept': 'application/json',
      'X-RapidAPI-Key': process.env.STOCKX_API_KEY,
      'X-RapidAPI-Host': process.env.STOCKX_API_HOST,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
  };

  try {
    console.log('Making request for:', formattedQuery);
    const response = await axios.request(options);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (!response.data || response.data.estimatedTotalHits === 0 || !response.data.hits) {
      console.log('No results found');
      return res.status(404).json({ error: 'No shoes found for the given query' });
    }

    const products = response.data.hits;
    if (products.length === 0) {
      return res.status(404).json({ error: 'No shoes found' });
    }

    const shoe = products[0];

    res.json({
      title: shoe.title || 'No title available',
      description: shoe.description || 'No description available',
      retail_price: shoe.retail_price || 'N/A',
      market_price: shoe.market?.price || 'N/A',
      brand: shoe.brand || 'N/A',
      image_url: shoe.image || null
    });

  } catch (error) {
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch shoes data',
      details: error.message
    });
  }
});

// Export our app so we can access it in server.js
module.exports = app;