/**
 * @fileoverview Mongoose model and functions for user operations.
 * @module models/user
 */

const mongoose = require('mongoose');
const logger = require('../logger');

/**
 * User schema definition.
 * @typedef {Object} User
 * @property {string} auth0Id - The Auth0 user ID.
 * @property {number} shoeSize - The shoe size of the user.
 * @property {Array<Object>} favorites - List of favorite shoes.
 */

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  shoeSize: { type: Number, required: true },
  favorites: [
    {
      title: { type: String, required: true },
      description: { type: String },
      retail_price: { type: String },
      market_price: { type: String },
      buy_now_price: { type: String },
      brand: { type: String },
      image_url: { type: String },
      added_on: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', userSchema);

/**
 * Creates or updates a user by Auth0 ID.
 * @async
 * @function saveUserShoeSize
 * @param {string} auth0Id - The Auth0 user ID.
 * @param {number} shoeSize - The shoe size of the user.
 * @returns {Promise<User>} The created or updated user.
 * @throws Will throw an error if the operation fails.
 */
async function saveUserShoeSize(auth0Id, shoeSize) {
  try {
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { shoeSize },
      { new: true, upsert: true }
    );
    return user;
  } catch (error) {
    logger.error('Error saving user shoe size:', error);
    throw error;
  }
}

/**
 * Gets a user's shoe size by Auth0 ID.
 * @async
 * @function getUserShoeSize
 * @param {string} auth0Id - The Auth0 user ID.
 * @returns {Promise<User|null>} The user document or null if not found.
 * @throws Will throw an error if the query fails.
 */
async function getUserShoeSize(auth0Id) {
  try {
    const user = await User.findOne({ auth0Id });
    return user;
  } catch (error) {
    logger.error('Error fetching user by Auth0 ID:', error);
    throw error;
  }
}

/**
 * Adds a shoe to a user's favorites list.
 * @async
 * @function addFavoriteShoe
 * @param {string} auth0Id - The Auth0 user ID.
 * @param {Object} shoe - The shoe object to add to favorites.
 * @returns {Promise<User>} The updated user with the new favorite added.
 * @throws Will throw an error if the operation fails.
 */
async function addFavoriteShoe(auth0Id, shoe) {
  try {
    // Check if shoe is already in favorites by title (could use more precise matching)
    const user = await User.findOne({
      auth0Id,
      'favorites.title': shoe.title
    });

    if (user) {
      logger.info(`Shoe "${shoe.title}" already in favorites for user ${auth0Id}`);
      return user;
    }

    // Add the shoe to favorites if not already present
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      { $push: { favorites: shoe } },
      { new: true, upsert: true }
    );

    logger.info(`Added shoe "${shoe.title}" to favorites for user ${auth0Id}`);
    return updatedUser;
  } catch (error) {
    logger.error('Error adding favorite shoe:', error);
    throw error;
  }
}

/**
 * Removes a shoe from a user's favorites list.
 * @async
 * @function removeFavoriteShoe
 * @param {string} auth0Id - The Auth0 user ID.
 * @param {string} shoeTitle - The title of the shoe to remove.
 * @returns {Promise<User>} The updated user with the favorite removed.
 * @throws Will throw an error if the operation fails.
 */
async function removeFavoriteShoe(auth0Id, shoeTitle) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      { $pull: { favorites: { title: shoeTitle } } },
      { new: true }
    );

    logger.info(`Removed shoe "${shoeTitle}" from favorites for user ${auth0Id}`);
    return updatedUser;
  } catch (error) {
    logger.error('Error removing favorite shoe:', error);
    throw error;
  }
}

/**
 * Gets all favorite shoes for a user.
 * @async
 * @function getUserFavorites
 * @param {string} auth0Id - The Auth0 user ID.
 * @returns {Promise<Array>} Array of favorite shoes or empty array if none found.
 * @throws Will throw an error if the query fails.
 */
async function getUserFavorites(auth0Id) {
  try {
    const user = await User.findOne({ auth0Id });
    return user ? user.favorites : [];
  } catch (error) {
    logger.error('Error fetching user favorites:', error);
    throw error;
  }
}

// Keep the legacy functions for backward compatibility
async function createUser(username, shoeSize) {
  logger.warn('createUser is deprecated, use saveUserShoeSize instead');
  try {
    const user = new User({ auth0Id: username, shoeSize });
    await user.save();
    return user;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
}

async function getUser(username) {
  logger.warn('getUser is deprecated, use getUserShoeSize instead');
  try {
    const user = await User.findOne({ auth0Id: username });
    return user;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
}

module.exports = {
  saveUserShoeSize,
  getUserShoeSize,
  addFavoriteShoe,
  removeFavoriteShoe,
  getUserFavorites,
  // Legacy exports
  createUser,
  getUser,
  User,
};
