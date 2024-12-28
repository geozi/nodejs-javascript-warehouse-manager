/**
 * Contains middleware functions that perform
 * validation controls on incoming HTTP requests.
 */

const { check } = require("express-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { PASSWORD_REGEX } = require("../resources/validationRegExp");

// Validation rules for user registration
const userRegistrationRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(validationErrorMessages.USERNAME_REQUIRED),
    check("email")
      .notEmpty()
      .withMessage(validationErrorMessages.EMAIL_REQUIRED),
    check("password")
      .notEmpty()
      .withMessage(validationErrorMessages.PASSWORD_REQUIRED)
      .isLength({ min: 7 })
      .withMessage(validationErrorMessages.PASSWORD_MIN_LENGTH)
      .matches(PASSWORD_REGEX)
      .withMessage(validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS),
    check("role").notEmpty().withMessage(validationErrorMessages.ROLE_REQUIRED),
  ];
};

// Validation rules for user registration
const customerAdditionRules = () => {
  return [
    check("firstName")
      .notEmpty()
      .withMessage(validationErrorMessages.FIRST_NAME_REQUIRED),
    check("lastName")
      .notEmpty()
      .withMessage(validationErrorMessages.LAST_NAME_REQUIRED),
    check("phoneNumber")
      .notEmpty()
      .withMessage(validationErrorMessages.PHONE_NUMBER_REQUIRED),
    check("city").notEmpty().withMessage(validationErrorMessages.CITY_REQUIRED),
    check("streetAddress")
      .notEmpty()
      .withMessage(validationErrorMessages.STREET_ADDRESS_REQUIRED),
    check("zipCode")
      .notEmpty()
      .withMessage(validationErrorMessages.ZIP_CODE_REQUIRED),
    check("customerType")
      .notEmpty()
      .withMessage(validationErrorMessages.CUSTOMER_TYPE_REQUIRED),
    check("username")
      .notEmpty()
      .withMessage(validationErrorMessages.USERNAME_REQUIRED),
  ];
};

module.exports = {
  userRegistrationRules,
  customerAdditionRules,
};
