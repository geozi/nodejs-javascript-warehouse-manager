/**
 * The User model schema is an abstract
 * representation of an application user.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMsg = require("../config/validationErrorMsg");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, validationErrorMsg.USERNAME_UNIQUE],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
