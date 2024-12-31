/**
 * Contains middleware functions that perform
 * validation controls on incoming HTTP requests.
 */

const { check } = require("express-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { PASSWORD_REGEX, ID_REGEX } = require("../resources/validationRegExp");

// Validation rules for user registration.
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

// Validation rules for customer addition.
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

// Validation rules for customer update.
const customerUpdateRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMessages.CUSTOMER_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.CUSTOMER_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.CUSTOMER_ID_LENGTH),
    check("firstName").optional(),
    check("lastName").optional(),
    check("phoneNumber").optional(),
    check("city").optional(),
    check("streetAddress").optional(),
    check("zipCode").optional(),
    check("customerType").optional(),
    check("username").optional(),
  ];
};

// Validation rules for customer deletion.
const customerDeletionRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMessages.CUSTOMER_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.CUSTOMER_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.CUSTOMER_ID_LENGTH),
  ];
};

// Validation rules for product addition.
const productAdditionRules = () => {
  return [
    check("name")
      .notEmpty()
      .withMessage(validationErrorMessages.PRODUCT_NAME_REQUIRED),
    check("price")
      .notEmpty()
      .withMessage(validationErrorMessages.PRICE_REQUIRED)
      .isNumeric()
      .withMessage(validationErrorMessages.PRICE_NUMERIC),
    check("category")
      .notEmpty()
      .withMessage(validationErrorMessages.CATEGORY_REQUIRED),
  ];
};

// Validation rules for product update.
const productUpdateRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMessages.PRODUCT_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.PRODUCT_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.PRODUCT_ID_LENGTH),
    check("name").optional(),
    check("price").optional(),
    check("category").optional(),
  ];
};

// Validation rules for product deletion.
const productDeletionRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMessages.PRODUCT_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.PRODUCT_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.PRODUCT_ID_LENGTH),
  ];
};

// Validation rules for stock creation.
const stockCreationRules = () => {
  return [
    check("productId")
      .notEmpty()
      .withMessage(validationErrorMessages.PRODUCT_ID_REQUIRED),
    check("numberOfUnits")
      .notEmpty()
      .withMessage(validationErrorMessages.UNIT_NUMBER_REQUIRED)
      .isNumeric()
      .withMessage(validationErrorMessages.UNIT_NUMBER_NUMERIC),
  ];
};

// Validation rules for stock update.
const stockUpdateRules = () => {
  return [
    check("productId")
      .notEmpty()
      .withMessage(validationErrorMessages.PRODUCT_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.PRODUCT_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.PRODUCT_ID_LENGTH),
    check("numberOfUnits").optional(),
  ];
};

// Validation rules for stock deletion.
const stockDeletionRules = () => [
  check("productId")
    .notEmpty()
    .withMessage(validationErrorMessages.PRODUCT_ID_REQUIRED)
    .matches(ID_REGEX)
    .withMessage(validationErrorMessages.PRODUCT_ID_INVALID)
    .isLength({ min: 24, max: 24 })
    .withMessage(validationErrorMessages.PRODUCT_ID_LENGTH),
];

// Validation rules for order creation.
const orderCreationRules = () => {
  return [
    check("customerId")
      .notEmpty()
      .withMessage(validationErrorMessages.CUSTOMER_ID_REQUIRED),
    check("products")
      .notEmpty()
      .withMessage(validationErrorMessages.PRODUCT_ITEMS_REQUIRED),
    check("orderDate")
      .notEmpty()
      .withMessage(validationErrorMessages.ORDER_DATE_REQUIRED),
    check("totalNumberOfUnits")
      .notEmpty()
      .withMessage(validationErrorMessages.TOTAL_UNIT_NUMBER_REQUIRED)
      .isNumeric()
      .withMessage(validationErrorMessages.TOTAL_UNIT_NUMBER_NUMERIC),
    check("totalCost")
      .notEmpty()
      .withMessage(validationErrorMessages.TOTAL_COST_REQUIRED)
      .isNumeric()
      .withMessage(validationErrorMessages.TOTAL_COST_NUMERIC),
    check("shippingAddress")
      .notEmpty()
      .withMessage(validationErrorMessages.SHIPPING_ADDRESS_REQUIRED),
    check("billingAddress")
      .notEmpty()
      .withMessage(validationErrorMessages.BILLING_ADDRESS_REQUIRED),
    check("status")
      .notEmpty()
      .withMessage(validationErrorMessages.STATUS_REQUIRED),
    check("shippingMethod")
      .notEmpty()
      .withMessage(validationErrorMessages.SHIPPING_METHOD_REQUIRED),
    check("paymentMethod")
      .notEmpty()
      .withMessage(validationErrorMessages.PAYMENT_METHOD_REQUIRED),
  ];
};

module.exports = {
  userRegistrationRules,
  customerAdditionRules,
  customerUpdateRules,
  customerDeletionRules,
  productAdditionRules,
  productUpdateRules,
  productDeletionRules,
  stockCreationRules,
  stockUpdateRules,
  stockDeletionRules,
  orderCreationRules,
};
