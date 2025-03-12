const { auth } = require('express-oauth2-jwt-bearer');
const logger = require('../logger');

// Auth0 middleware to validate JWT tokens
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

// Simple middleware to extract Auth0 user ID from the token
const extractAuth0Id = (req, res, next) => {
  try {
    if (req.auth && req.auth.payload) {
      // Extract just the user ID (sub) from the Auth0 token payload
      req.auth0Id = req.auth.payload.sub;
    }
    next();
  } catch (error) {
    logger.error('Error extracting Auth0 ID:', error);
    next(error);
  }
};

module.exports = {
  checkJwt,
  extractAuth0Id,
};
