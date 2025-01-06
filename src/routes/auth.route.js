/**
 * Authentication routes.
 * @module routes/auth
 */
const express = require("express");
const authRouter = express.Router();
const authController = require("../auth/authController");

/**
 * Route for user login.
 * @memberof module:routes/auth
 * @param {String} path - Express path.
 * @param {Array} authController.login - Contains ValidationChain and user login logic.
 */
authRouter.post("/", authController.login);

module.exports = { authRouter };
