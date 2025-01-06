/**
 * User controller functions.
 * @module src/controllers/user
 */

const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const {
  userRegistrationRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");

/**
 * Middleware array that contains user registration logic.
 *
 * @memberof module:src/controllers/user
 * @type {Array<Function>}
 * @property {Array<Function>} userRegistrationRules - Express validation rules for user registration.
 * @property {Function} anonymousAsyncFunction - Handles user registration requests and responses.
 *
 */
const create = [
  ...userRegistrationRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMessage = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { username, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        role: role,
      });

      await newUser.save();
      res.status(201).json({ message: responseMessages.USER_REGISTERED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = { create };
