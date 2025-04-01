const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createUser, getUser, saveUserShoeSize, getUserShoeSize, addFavoriteShoe, removeFavoriteShoe, getUserFavorites } = require('./models/user');
const axios = require('axios');

// author and version from our package.json file
const { author, version } = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});

// Import Auth0 middleware
const { checkJwt, extractAuth0Id } = require('./middleware/auth');

// Create an express app instance
const app = express();

// Use middleware
app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Public routes
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/CAPSTONE-2025/Group_11',
    version,
  });
});

// Public endpoint to fetch shoes data
app.get('/shoes/:query', checkJwt, extractAuth0Id, async (req, res) => {
  const { query } = req.params;

  // Replace dashes with spaces for better search
  const formattedQuery = query.replace(/-/g, ' ');

  // Fetch user shoe size from DB
  let userShoeSize;
  try {
    const user = await getUserShoeSize(req.auth0Id);
    if (!user) {
      return res.status(404).json({ error: 'No shoe size found for this user' });
    }
    userShoeSize = user.shoeSize;
  } catch (err) {
    logger.error('Error fetching user shoe size:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // StockX API options
  const options = {
    method: 'GET',
    url: 'https://stockx-api.p.rapidapi.com/search',
    params: {
      query: formattedQuery,
      page: 1,
      limit: 10, // Fetch up to 10 results
    },
    headers: {
      'Accept': 'application/json',
      'X-RapidAPI-Key': process.env.STOCKX_API_KEY,
      'X-RapidAPI-Host': process.env.STOCKX_API_HOST,
      'User-Agent': 'Mozilla/5.0',
    },
  };

  try {
    const response = await axios.request(options);
    if (!response.data || !response.data.hits) {
      return res.status(404).json({ error: 'No shoes found for the given query' });
    }

    // Process multiple shoes (up to 10)
    const shoes = response.data.hits.slice(0, 10).map((shoe) => {
      const variants = shoe.variants || [];

      // Find the variant with the requested size
      const sizeVariant = variants.find((variant) => variant.size === userShoeSize);

      // Extract pricing information
      const marketPrice =
        sizeVariant && sizeVariant.market
          ? sizeVariant.market.price
          : shoe.market && shoe.market.price
            ? shoe.market.price
            : 'N/A';

      // Look for "Buy Now" price in various possible locations
      let buyNowPrice = 'N/A';
      if (sizeVariant) {
        if (sizeVariant.lowestAsk) buyNowPrice = sizeVariant.lowestAsk;
        else if (sizeVariant.buyNow) buyNowPrice = sizeVariant.buyNow;
        else if (sizeVariant.ask) buyNowPrice = sizeVariant.ask;
      } else if (shoe) {
        if (shoe.lowestAsk) buyNowPrice = shoe.lowestAsk;
        else if (shoe.buyNow) buyNowPrice = shoe.buyNow;
        else if (shoe.ask) buyNowPrice = shoe.ask;
      }

      return {
        title: shoe.title || 'No title available',
        description: shoe.description || 'No description available',
        retail_price: shoe.retail_price || 'N/A',
        market_price: marketPrice,
        buy_now_price: buyNowPrice,
        user_size: userShoeSize, // Include the size searched for
        brand: shoe.brand || 'N/A',
        image_url: shoe.image || null,
      };
    });

    res.json(shoes); // Return an array of shoes
  } catch (error) {
    console.error('Error fetching shoes:', error);
    res.status(500).json({
      error: 'Failed to fetch shoes data',
      details: error.message,
    });
  }
});

// Legacy routes - keep for backward compatibility
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

// Protected routes - require Auth0 authentication
// These are new endpoints that use Auth0 authentication
const protectedRouter = express.Router();
app.use('/api', checkJwt, extractAuth0Id, protectedRouter);

// Get the user's shoe size (protected route)
protectedRouter.get('/shoe-size', async (req, res) => {
  try {
    const user = await getUserShoeSize(req.auth0Id);

    if (!user) {
      return res.status(404).json({
        message: 'No shoe size found for this user',
        auth0Id: req.auth0Id
      });
    }

    res.status(200).json({
      auth0Id: user.auth0Id,
      shoeSize: user.shoeSize
    });
  } catch (err) {
    logger.error('Error fetching shoe size', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Save or update the user's shoe size (protected route)
protectedRouter.post('/shoe-size', async (req, res) => {
  const { shoeSize } = req.body;

  if (shoeSize === undefined || shoeSize === null) {
    return res.status(400).json({ error: 'Shoe size is required' });
  }

  if (typeof shoeSize !== 'number') {
    return res.status(400).json({ error: 'Shoe size must be a number' });
  }

  try {
    const user = await saveUserShoeSize(req.auth0Id, shoeSize);
    res.status(200).json({
      auth0Id: user.auth0Id,
      shoeSize: user.shoeSize,
      message: 'Shoe size saved successfully'
    });
  } catch (err) {
    logger.error('Error saving shoe size', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Get user's favorite shoes
protectedRouter.get('/favorites', async (req, res) => {
  try {
    const favorites = await getUserFavorites(req.auth0Id);
    res.status(200).json({
      auth0Id: req.auth0Id,
      favorites
    });
  } catch (err) {
    logger.error('Error fetching favorites', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Add a shoe to favorites
protectedRouter.post('/favorites', async (req, res) => {
  const shoeData = req.body;

  if (!shoeData || !shoeData.title) {
    return res.status(400).json({ error: 'Valid shoe data is required' });
  }

  try {
    const user = await addFavoriteShoe(req.auth0Id, shoeData);
    res.status(200).json({
      message: 'Shoe added to favorites successfully',
      auth0Id: user.auth0Id,
      favorites: user.favorites
    });
  } catch (err) {
    logger.error('Error adding favorite', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Remove a shoe from favorites
protectedRouter.delete('/favorites/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const user = await removeFavoriteShoe(req.auth0Id, title);
    res.status(200).json({
      message: 'Shoe removed from favorites successfully',
      auth0Id: user.auth0Id,
      favorites: user.favorites
    });
  } catch (err) {
    logger.error('Error removing favorite', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Simple auth check endpoint - just to verify authentication is working
protectedRouter.get('/auth-check', (req, res) => {
  res.status(200).json({
    message: 'Authentication successful',
    auth0Id: req.auth0Id,
    timestamp: new Date().toISOString()
  });
});

// Export our app so we can access it in server.js
module.exports = app;
