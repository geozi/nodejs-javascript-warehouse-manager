/**
 * User routes.
 * @module routes/user
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/**
 * Route for user registration.
 * @memberof module:routes/user
 * @param {String} path - Express path.
 * @param {Array} userController.create - Contains ValidationChain and new user creation logic.
 */
router.post("/register", userController.create);

module.exports = { router };
