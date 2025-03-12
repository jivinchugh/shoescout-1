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
 */

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  shoeSize: { type: Number, required: true },
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
  // Legacy exports
  createUser,
  getUser,
  User,
};
