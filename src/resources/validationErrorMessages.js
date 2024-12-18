/**
 * Contains the errors messages that are sent in response
 * to validation errors.
 */

module.exports = {
  // User model validation messages
  USERNAME_REQUIRED: "Username is a required field",
  USERNAME_MAX_LENGTH: "Username must be no longer than 20 characters",
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters long",
  USERNAME_UNIQUE: "Username must be unique",
  EMAIL_REQUIRED: "Email is a required field",
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_REQUIRED: "Password is a required field",
  PASSWORD_MIN_LENGTH: "Password must be at least 7 characters long",
  PASSWORD_MUST_HAVE_CHARACTERS:
    "Password must contain at least one lowercase character, one uppercase character, one number, and one special symbol",
  ROLE_REQUIRED: "Role is a required field",
  ROLE_INVALID: "Role must be either admin or customer",

  // Customer model validation messages
  FIRST_NAME_REQUIRED: "First name is a required field",
  FIRST_NAME_MIN_LENGTH: "First name must be at least 2 characters long",
  FIRST_NAME_INVALID: "First name must contain only letters",
  LAST_NAME_REQUIRED: "Last name is a required field",
  LAST_NAME_MIN_LENGTH: "Last name must be at least 2 characters long",
  LAST_NAME_INVALID: "Last name must contain only letters",
  PHONE_NUMBER_REQUIRED: "Phone number is a required field",
  PHONE_NUMBER_INVALID:
    "Phone number must follow this pattern: 123456789 or 123-456-789",
  PHONE_NUMBER_MIN_LENGTH:
    "Phone number must be at least 7 characters long (digits and hyphens).",
  CITY_REQUIRED: "City is a required field",
  CITY_INVALID: "City must contain only letters and hyphens",
  STREET_ADDRESS_REQUIRED: "Street address is a required field ",
  ZIP_CODE_REQUIRED: "Zip code is a required field",
  ZIP_CODE_INVALID: "Zip code must contain 5 digits",
  CUSTOMER_TYPE_REQUIRED: "Customer type is a required field",
  CUSTOMER_TYPE_INVALID: "Customer type must be either wholesale or retail",
};
