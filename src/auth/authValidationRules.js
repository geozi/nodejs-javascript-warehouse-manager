/**
 * Contains middleware functions that perform
 * validation controls on authentication requests.
 */

const { check, header } = require("express-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { PASSWORD_REGEX } = require("../resources/validationRegExp");
const authMessages = require("./authResponseMessages");

// Validation rules for user login.
const userLoginRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(validationErrorMessages.USERNAME_REQUIRED),
    check("password")
      .notEmpty()
      .withMessage(validationErrorMessages.PASSWORD_REQUIRED)
      .isLength({ min: 7 })
      .withMessage(validationErrorMessages.PASSWORD_MIN_LENGTH)
      .matches(PASSWORD_REGEX)
      .withMessage(validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS),
  ];
};

// Validation rules for HTTP headers.
const headerValidationRules = () => {
  return [
    header("Authorization")
      .notEmpty()
      .withMessage(authMessages.AUTH_HEADER_REQUIRED),
  ];
};

module.exports = { userLoginRules, headerValidationRules };
