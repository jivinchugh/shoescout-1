const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createUser, getUser, saveUserShoeSize, getUserShoeSize, addFavoriteShoe, removeFavoriteShoe, getUserFavorites } = require('./models/user');
const axios = require('axios');
const retryRequest = require('./retryAxios');

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

function normalizeResellData(apiData) {
  const lowest = apiData?.lowestResellPrice || {};
  const links = apiData?.resellLinks || {};
  const prices = apiData?.resellPrices || {};

  const fallbackPrices = (() => {
    const brands = ['stockX', 'goat', 'flightClub', 'stadiumGoods'];
    const fallback = {};
    brands.forEach(brand => {
      const data = prices[brand];
      if (Array.isArray(data)) {
        const valid = data.filter(p => typeof p.price === 'number');
        if (valid.length) fallback[brand] = Math.min(...valid.map(v => v.price));
      } else if (data?.newLowestPrice?.value) {
        fallback[brand] = data.newLowestPrice.value / 100;
      }
    });
    return fallback;
  })();

  const resellPrices = Object.keys(lowest).length ? lowest : fallbackPrices;

  return {
    lowest_resell_prices: {
      stockX: resellPrices.stockX || null,
      goat: resellPrices.goat || null,
      flightClub: resellPrices.flightClub || null,
      stadiumGoods: resellPrices.stadiumGoods || null
    },
    resell_links: {
      stockX: links.stockX || '',
      goat: links.goat || '',
      flightClub: links.flightClub || '',
      stadiumGoods: links.stadiumGoods || ''
    },
    resell_data_found: Object.values(resellPrices).some(p => p !== null && p !== undefined)
  };
}

app.get('/shoes/:query', async (req, res) => {
  const query = req.params.query;
  const retailOptions = {
    method: 'GET',
    url: `https://${process.env.STOCKX_API_HOST}/search?query=${encodeURIComponent(query)}`,
    headers: {
      'X-RapidAPI-Key': process.env.STOCKX_API_KEY,
      'X-RapidAPI-Host': process.env.STOCKX_API_HOST
    }
  };

  try {
    const retailRes = await retryRequest(retailOptions);
    if (!retailRes.data?.hits) return res.status(404).json({ error: 'No shoes found.' });

    const results = await Promise.all(retailRes.data.hits.slice(0, 10).map(async (shoe) => {
      const { title, retailPrice, description = '', sku = '' } = shoe;
      const cleanedTitle = title.replace(/\s*\(.*?\)/g, '').trim();

      let normalizedResellData = {
        lowest_resell_prices: {},
        resell_links: {},
        resell_data_found: false
      };

      logger.debug(`Trying resell API with styleId=${sku}`);
      try {
        const skuRes = await retryRequest({
          method: 'GET',
          url: `https://${process.env.SNEAKER_DB_API_HOST}/productprice`,
          params: { styleId: sku },
          headers: {
            'X-RapidAPI-Key': process.env.SNEAKER_DB_API_KEY,
            'X-RapidAPI-Host': process.env.SNEAKER_DB_API_HOST,
          },
        });
        if (skuRes.data) {
          normalizedResellData = normalizeResellData(skuRes.data);
        }
      } catch (err) {
        logger.debug(`SKU lookup failed for ${sku}, falling back to search: ${err.message}`);
      }

      if (!normalizedResellData.resell_data_found) {
        try {
          const searchRes = await retryRequest({
            method: 'GET',
            url: `https://${process.env.SNEAKER_DB_API_HOST}/search`,
            params: { query: cleanedTitle },
            headers: {
              'X-RapidAPI-Key': process.env.SNEAKER_DB_API_KEY,
              'X-RapidAPI-Host': process.env.SNEAKER_DB_API_HOST,
            }
          });
          if (searchRes.data?.hits) {
            const match = searchRes.data.hits.find(item => item.styleID?.toLowerCase() === sku.toLowerCase()) ||
              searchRes.data.hits.find(item => item.styleID?.includes(sku) || sku.includes(item.styleID));
            if (match) {
              normalizedResellData = normalizeResellData(match);
            }
          }
        } catch (err) {
          logger.warn(`Fallback search failed for ${cleanedTitle}: ${err.message}`);
        }
      }

      return {
        title,
        retail_price: retailPrice,
        description,
        sku,
        image_url: shoe.image || '',
        ...normalizedResellData
      };
    }));

    res.json(results);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: 'Failed to fetch shoe data' });
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
  
  // Add validation for decimal values and max size
  if (shoeSize <= 0 || shoeSize > 15) {
    return res.status(400).json({ error: 'Shoe size must be between 0 and 15' });
  }
  
  // Check if it's a whole number or ends with .5
  const isValid = Number.isInteger(shoeSize) || 
                  (shoeSize * 10) % 5 === 0; // Checks if decimal part is .0 or .5
                  
  if (!isValid) {
    return res.status(400).json({ error: 'Shoe size must be a whole number or end with .5' });
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
