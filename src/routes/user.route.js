/**
 * User routes.
 * @module routes/user
 */
const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");

/**
 * Route for user registration.
 * @memberof module:routes/user
 * @param {String} path - Express path.
 * @param {Array} userController.create - Contains ValidationChain and new user creation logic.
 */
userRouter.post("/", userController.create);

module.exports = { userRouter };
