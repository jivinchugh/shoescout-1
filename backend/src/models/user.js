/**
 * @fileoverview Mongoose model and functions for user operations.
 * @module models/user
 */

const mongoose = require("mongoose");
const logger = require('../logger');

/**
 * User schema definition.
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {number} shoeSize - The shoe size of the user.
 */

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    shoeSize: { type: Number, required: true }
});

const User = mongoose.model("User", userSchema);

/**
 * Creates a new user.
 * @async
 * @function createUser
 * @param {string} username - The username of the user.
 * @param {number} shoeSize - The shoe size of the user.
 * @returns {Promise<User>} The created user.
 * @throws Will throw an error if the user cannot be created.
 */

async function createUser(username, shoeSize) {
    try {
        const user = new User({ username, shoeSize });
        await user.save();
        return user;
    } catch (error) {
        logger.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Fetches a user by username.
 * @async
 * @function getUser
 * @param {string} username - The username of the user.
 * @returns {Promise<User|null>} The fetched user or null if not found.
 * @throws Will throw an error if the user cannot be fetched.
 */

async function getUser(username) {
    try {
        const user = await User.findOne({ username });
        return user;
    } catch (error) {
        logger.error('Error fetching user:', error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUser,
    User
};
