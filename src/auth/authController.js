/**
 * Auth controller functions.
 * @module src/auth/authController
 */

require("dotenv").config();
const validator = require("express-validator");
const authMessages = require("./authResponseMessages");
const responseMessages = require("../resources/responseMessages");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const {
  userLoginRules,
  headerValidationRules,
} = require("./authValidationRules");
const jwt = require("jsonwebtoken");

/**
 * Middleware array that contains user login logic.
 *
 * @memberof module:src/auth/authController
 * @type {Array<Function>}
 * @property {Array<Function>} userLoginRules - Express validation rules for user login.
 * @property {Function} anonymousAsyncFunction - Handles user login requests and responses.
 *
 */
const login = [
  ...userLoginRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });

      if (!user) {
        return res.status(401).json({ message: authMessages.AUTH_FAILED });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: authMessages.AUTH_FAILED });
      }

      const token = jwt.sign({ username: user.username }, process.env.KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({ token: token });
      /*eslint-disable no-unused-vars*/
    } catch (err) {
      /*eslint-enable no-unused-vars*/
      res.status(500).json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains token validation logic.
 *
 * @memberof module:src/auth/authController
 * @type {Array<Function>}
 * @property {Array<Function>} headerValidationRules - Express validation rules for token validation.
 * @property {Function} anonymousAsyncFunction - Handles token validation processes.
 *
 */
const verifyToken = [
  ...headerValidationRules(),
  async (req, res, next) => {
    const expressErrors = validator.validationResult(req);

    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));
      return res.status(401).json({ errors: errorMsg });
    }

    try {
      const token = req.header("Authorization");
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.KEY);
      req.body.username = decoded.username;
      next();
      /*eslint-disable no-unused-vars*/
    } catch (err) {
      /*eslint-enable no-unused-vars*/
      res.status(401).json({ message: authMessages.TOKEN_INVALID });
    }
  },
];

module.exports = { login, verifyToken };
