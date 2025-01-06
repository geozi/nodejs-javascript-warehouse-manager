/**
 * User schema.
 * @module src/models/user
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { EMAIL_REGEX } = require("../resources/validationRegExp");

/**
 * User schema for persistence in MongoDB.
 *
 * @memberof module:src/models/user
 * @type {mongoose.Schema<User>}
 * @typedef {Object} User
 * @property {String} username - The username of the user.
 * @property {String} email - The email of the user.
 * @property {String} password - The password of the user.
 * @property {String} role - The role of the user.
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, validationErrorMessages.USERNAME_REQUIRED],
      unique: [true, validationErrorMessages.USERNAME_UNIQUE],
      maxLength: [20, validationErrorMessages.USERNAME_MAX_LENGTH],
      minLength: [3, validationErrorMessages.USERNAME_MIN_LENGTH],
      trim: true,
    },
    email: {
      type: String,
      required: [true, validationErrorMessages.EMAIL_REQUIRED],
      match: [EMAIL_REGEX, validationErrorMessages.EMAIL_INVALID],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, validationErrorMessages.PASSWORD_REQUIRED],
      trim: true,
    },
    role: {
      type: String,
      required: [true, validationErrorMessages.ROLE_REQUIRED],
      enum: {
        values: ["admin", "customer"],
        message: validationErrorMessages.ROLE_INVALID,
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
