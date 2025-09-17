const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createUser, getUser, saveUserShoeSize, getUserShoeSize, saveUserPreferences, addFavoriteShoe, removeFavoriteShoe, getUserFavorites } = require('./models/user');
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

// Add at the top of your file with other variable declarations:
const searchCache = {};

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
  
  // Add basic caching with a simple in-memory store
  const cacheKey = query.toLowerCase();
  if (searchCache[cacheKey] && Date.now() - searchCache[cacheKey].timestamp < 3600000) { // 1 hour cache
    logger.info(`Returning cached results for "${query}"`);
    return res.json(searchCache[cacheKey].results);
  }
  
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

    const shoes = retailRes.data.hits.slice(0, 5);

    // Process basic shoe data
    const basicResults = shoes.map(shoe => {
      return {
        title: shoe.title,
        retail_price: shoe.retail_price || 'N/A',
        description: shoe.description || '',
        sku: shoe.sku || '',
        image_url: shoe.image || '',
        lowest_resell_prices: {},
        resell_links: {},
        resell_data_found: false
      };
    });
    
    // Try to fetch detailed pricing data for the first shoe
    if (shoes[0]?.sku) {
      try {
        const skuRes = await retryRequest({
          method: 'GET',
          url: `https://${process.env.SNEAKER_DB_API_HOST}/productprice`,
          params: { styleId: shoes[0].sku },
          headers: {
            'X-RapidAPI-Key': process.env.SNEAKER_DB_API_KEY,
            'X-RapidAPI-Host': process.env.SNEAKER_DB_API_HOST,
          },
        });

        if (skuRes.data) {
          const resellData = normalizeResellData(skuRes.data);
          basicResults[0] = {...basicResults[0], ...resellData};
        }
      } catch (err) {
        logger.debug(`Resell data fetch failed for ${shoes[0].sku}: ${err.message}`);
      }
    }
    
    // Now we can cache and send the response after all processing is complete
    searchCache[cacheKey] = {
      results: basicResults,
      timestamp: Date.now()
    };
    
    res.json(basicResults);
    
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

// Get user's brand preferences (protected route)
protectedRouter.get('/user-preferences', async (req, res) => {
  try {
    const user = await getUser(req.auth0Id);
    res.status(200).json({
      auth0Id: req.auth0Id,
      preferences: user?.preferences || []
    });
  } catch (err) {
    logger.error('Error fetching user preferences', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Save or update the user's brand preferences (protected route)
protectedRouter.post('/user-preferences', async (req, res) => {
  const { preferences } = req.body;

  if (!Array.isArray(preferences)) {
    return res.status(400).json({ error: 'Preferences must be an array' });
  }

  if (preferences.length > 3) {
    return res.status(400).json({ error: 'Maximum 3 brand preferences allowed' });
  }

  try {
    const user = await saveUserPreferences(req.auth0Id, preferences);
    res.status(200).json({
      auth0Id: user.auth0Id,
      preferences: user.preferences,
      message: 'Brand preferences saved successfully'
    });
  } catch (err) {
    logger.error('Error saving user preferences', err);
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

  // Recommendation endpoint: suggest shoes based on user's preferences or favorite brands
  protectedRouter.get('/recommendations', async (req, res) => {
    try {
      // Get user's preferences first
      const user = await getUser(req.auth0Id);
      let brandsToUse = [];
      
      if (user?.preferences && user.preferences.length > 0) {
        // Use user-selected preferences if available
        brandsToUse = user.preferences;
        logger.info(`Using user preferences for recommendations: ${brandsToUse.join(', ')}`);
      } else {
        // Fall back to extracting brands from favorites
        const favorites = await getUserFavorites(req.auth0Id);
        if (!favorites || favorites.length === 0) {
          return res.status(200).json({ recommendations: [], message: 'No preferences or favorites found for user.' });
        }

        // Extract brands from favorites
        const brandCounts = {};
        favorites.forEach(fav => {
          if (fav.brand) {
            brandCounts[fav.brand] = (brandCounts[fav.brand] || 0) + 1;
          }
        });
        
        // Sort brands by frequency and take top 2
        const sortedBrands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);
        if (sortedBrands.length === 0) {
          return res.status(200).json({ recommendations: [], message: 'No brand preferences found.' });
        }
        brandsToUse = sortedBrands.slice(0, 2);
        logger.info(`Using brands from favorites for recommendations: ${brandsToUse.join(', ')}`);
      }

      // Fetch recommended shoes for the selected brands
      const recommended = [];
      const targetPerBrand = Math.ceil(40 / brandsToUse.length); // Distribute 40 shoes across brands
      
      for (const brand of brandsToUse) {
        let brandShoes = [];
        
        // Use specific shoe keywords to filter for shoes only
        const shoeKeywords = ['sneakers', 'shoes', 'jordans', 'boots', 'running shoes', 'basketball shoes', 'tennis shoes'];
        
        for (const keyword of shoeKeywords) {
          // If we already have enough shoes for this brand, break
          if (brandShoes.length >= targetPerBrand) break;
          
          const retailOptions = {
            method: 'GET',
            url: `https://${process.env.STOCKX_API_HOST}/search?query=${encodeURIComponent(`${brand} ${keyword}`)}`,
            headers: {
              'X-RapidAPI-Key': process.env.STOCKX_API_KEY,
              'X-RapidAPI-Host': process.env.STOCKX_API_HOST
            }
          };
          
          try {
            const retailRes = await retryRequest(retailOptions);
            if (retailRes.data?.hits) {
              // Filter out non-shoe items by checking title for shoe-related terms
              const filteredShoes = retailRes.data.hits.filter(shoe => {
                const title = shoe.title.toLowerCase();
                
                // Define shoe-related terms (must include at least one)
                const shoeTerms = [
                  'shoe', 'sneaker', 'jordan', 'air force', 'air max', 'air jordan',
                  'runner', 'trainer', 'boot', 'loafer', 'oxford', 'slip-on',
                  'sandal', 'flip-flop', 'cleat', 'basketball', 'tennis',
                  'running', 'athletic', 'casual', 'formal', 'dress shoe',
                  'pump', 'heel', 'flat', 'moccasin', 'espadrille', 'wedge'
                ];
                
                // Define non-shoe items to exclude (if any of these are found, exclude the item)
                const excludeTerms = [
                  'bag', 'backpack', 'sock', 'socks', 'tote', 'purse', 'wallet',
                  'belt', 'hat', 'cap', 'beanie', 'shirt', 'hoodie', 'jacket',
                  'pants', 'shorts', 'gloves', 'scarf', 'card', 'trading card',
                  'pokemon', 'pokémon', 'collectible', 'figurine', 'toy',
                  'accessory', 'keychain', 'sticker', 'poster', 'phone case',
                  'watch', 'sunglasses', 'necklace', 'bracelet', 'ring',
                  'earring', 'underwear', 'brief', 'boxer', 'bra', 'panty'
                ];
                
                // Check if title contains any shoe terms
                const hasShoeTerms = shoeTerms.some(term => title.includes(term));
                
                // Check if title contains any exclude terms
                const hasExcludeTerms = excludeTerms.some(term => title.includes(term));
                
                // Only include if it has shoe terms AND doesn't have exclude terms
                return hasShoeTerms && !hasExcludeTerms;
              });
              
              // Add shoes to brand collection, avoiding duplicates
              for (const shoe of filteredShoes) {
                if (brandShoes.length >= targetPerBrand) break;
                
                // Check for duplicates by title
                const isDuplicate = brandShoes.some(existing => existing.title === shoe.title);
                if (!isDuplicate) {
                  brandShoes.push({
                    title: shoe.title,
                    retail_price: shoe.retail_price || 'N/A',
                    description: shoe.description || '',
                    sku: shoe.sku || '',
                    image_url: shoe.image || '',
                    brand: brand
                  });
                }
              }
            }
          } catch (err) {
            logger.error(`Failed to fetch recommendations for brand ${brand} with keyword ${keyword}: ${err.message}`);
          }
        }
        
        // Add this brand's shoes to the overall collection
        recommended.push(...brandShoes);
        logger.info(`Added ${brandShoes.length} shoes for brand ${brand}`);
      }
      
      // If we don't have exactly 40, trim or pad as needed
      let finalRecommendations = [...recommended];
      if (finalRecommendations.length > 40) {
        // Shuffle first, then take exactly 40
        for (let i = finalRecommendations.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalRecommendations[i], finalRecommendations[j]] = [finalRecommendations[j], finalRecommendations[i]];
        }
        finalRecommendations = finalRecommendations.slice(0, 40);
      } else if (finalRecommendations.length < 40) {
        // If we have fewer than 40, try to fetch more from a broader search
        const additionalNeeded = 40 - finalRecommendations.length;
        logger.info(`Need ${additionalNeeded} more shoes to reach 40 total`);
        
        // Broader search for popular shoe brands to fill the gap
        const popularBrands = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Vans', 'Converse'];
        
        for (const brand of popularBrands) {
          if (finalRecommendations.length >= 40) break;
          
          const retailOptions = {
            method: 'GET',
            url: `https://${process.env.STOCKX_API_HOST}/search?query=${encodeURIComponent(`${brand} shoes`)}`,
            headers: {
              'X-RapidAPI-Key': process.env.STOCKX_API_KEY,
              'X-RapidAPI-Host': process.env.STOCKX_API_HOST
            }
          };
          
          try {
            const retailRes = await retryRequest(retailOptions);
            if (retailRes.data?.hits) {
              const filteredShoes = retailRes.data.hits.filter(shoe => {
                const title = shoe.title.toLowerCase();
                const hasShoeTerms = ['shoe', 'sneaker', 'jordan', 'air', 'runner', 'trainer', 'boot'].some(term => title.includes(term));
                const hasExcludeTerms = ['bag', 'sock', 'card', 'pokemon', 'accessory'].some(term => title.includes(term));
                const isDuplicate = finalRecommendations.some(existing => existing.title === shoe.title);
                return hasShoeTerms && !hasExcludeTerms && !isDuplicate;
              });
              
              for (const shoe of filteredShoes.slice(0, additionalNeeded)) {
                if (finalRecommendations.length >= 40) break;
                finalRecommendations.push({
                  title: shoe.title,
                  retail_price: shoe.retail_price || 'N/A',
                  description: shoe.description || '',
                  sku: shoe.sku || '',
                  image_url: shoe.image || '',
                  brand: brand
                });
              }
            }
          } catch (err) {
            logger.error(`Failed to fetch additional shoes for brand ${brand}: ${err.message}`);
          }
        }
      }
      
      // Final shuffle of exactly 40 recommendations
      for (let i = finalRecommendations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalRecommendations[i], finalRecommendations[j]] = [finalRecommendations[j], finalRecommendations[i]];
      }
      
      logger.info(`Returning exactly ${finalRecommendations.length} randomized recommendations`);
      res.status(200).json({ recommendations: finalRecommendations });
    } catch (err) {
      logger.error('Error generating recommendations', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  });
// Export our app so we can access it in server.js
module.exports = app;