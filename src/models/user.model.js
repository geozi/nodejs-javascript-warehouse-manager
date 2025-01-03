const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { EMAIL_REGEX } = require("../resources/validationRegExp");

/**
 * Represents a User.
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
