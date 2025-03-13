const { auth } = require('express-oauth2-jwt-bearer');
const logger = require('../logger');

// Auth0 middleware to validate JWT tokens
let checkJwt;

try {
  // Log environment variables for debugging
  logger.debug('Auth0 config:', {
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  });

  if (!process.env.AUTH0_AUDIENCE || !process.env.AUTH0_ISSUER_BASE_URL) {
    logger.warn('Missing Auth0 environment variables. JWT verification will be disabled.');
    // Provide a dummy middleware when Auth0 is not configured
    checkJwt = (req, res, next) => {
      logger.warn('Auth0 verification skipped - not configured');
      req.auth = { payload: { sub: 'development-user' } };
      next();
    };
  } else {
    checkJwt = auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    });
  }
} catch (error) {
  logger.error('Error setting up Auth0 middleware:', error);
  // Fallback middleware that will log errors but allow requests
  checkJwt = (req, res, next) => {
    logger.error('Auth0 verification error - using fallback');
    req.auth = { payload: { sub: 'error-fallback-user' } };
    next();
  };
}

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
