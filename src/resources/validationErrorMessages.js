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
  CUSTOMER_ID_INVALID: "Customer ID must only contain alphanumeric characters",
  CUSTOMER_ID_LENGTH: "Customer ID must be 24 characters long",
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

  // Product model validation messages
  PRODUCT_NAME_REQUIRED: "Product name is a required field",
  PRODUCT_NAME_UNIQUE: "Product name must be unique",
  PRICE_REQUIRED: "Price is a required field",
  PRICE_NEGATIVE: "Price must be a positive number",
  CATEGORY_REQUIRED: "Category is a required field",
  CATEGORY_INVALID: `
  **Category must be one of the following:**
  - **Activity**
  - **Automotive**
  - **Beauty**
  - **Clothing**
  - **Electronics**
  - **Entertainment**
  - **Health**
  - **Home**
  - **Pets**
  `,

  // Stock model validation messages
  PRODUCT_ID_REQUIRED: "Product ID is a required field",
  PRODUCT_ID_INVALID: "Product ID must only contain alphanumeric characters",
  PRODUCT_ID_LENGTH: "Product ID must be 24 characters in length",
  UNIT_NUMBER_REQUIRED: "Number of units is a required field",
  UNIT_NUMBER_NEGATIVE: "Number of units must be a positive number",

  // Order model validation messages
  CUSTOMER_ID_REQUIRED: "Customer ID is a required field",
  PRODUCT_ITEMS_REQUIRED: "The order must contain at least 1 product",
  ORDER_DATE_REQUIRED: "Order date is a required field",
  TOTAL_UNIT_NUMBER_REQUIRED: "Total number of units is a required field",
  TOTAL_UNIT_NUMBER_ABOVE_ZERO: "Total number of units must be at least 1",
  TOTAL_COST_REQUIRED: "Total cost is a required field",
  TOTAL_COST_ABOVE_ZERO: "Total cost must be above 0",
  SHIPPING_ADDRESS_REQUIRED: "Shipping address is a required field",
  STATUS_REQUIRED: "Status is a required field",
  STATUS_INVALID: `
  **Status must be one of the following:**
  - **Pending**
  - **Shipped**
  - **Delivered**
  - **Canceled**
  `,
  SHIPPING_METHOD_REQUIRED: "Shipping method is a required field",
  SHIPPING_METHOD_INVALID: `
  **Shipping method must be one of the following:**
  - **Standard**,
  - **Express**
  `,
  PAYMENT_METHOD_REQUIRED: "Payment method is a required field",
  PAYMENT_METHOD_INVALID: `
  **Payment method must be one of the following:**
  - **Credit/Debit card**
  - **Cash**
  `,
  BILLING_ADDRESS_REQUIRED: "Billing address is required field",
};
