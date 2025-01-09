/**
 * Validation rules for incoming HTTP requests.
 * @module src/middleware/expressValidationRules
 */

const { check } = require("express-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { PASSWORD_REGEX, ID_REGEX } = require("../resources/validationRegExp");

/**
 * Returns a validation chain for user registration.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for customer addition.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for customer info update.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for customer info deletion.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for product addition.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for product info update.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for product info deletion.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for stock creation.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for stock update.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for stock deletion.
 * @returns {ValidationChain[]} - Validation chain.
 */
const stockDeletionRules = () => [
  check("productId")
    .notEmpty()
    .withMessage(validationErrorMessages.PRODUCT_ID_REQUIRED)
    .matches(ID_REGEX)
    .withMessage(validationErrorMessages.PRODUCT_ID_INVALID)
    .isLength({ min: 24, max: 24 })
    .withMessage(validationErrorMessages.PRODUCT_ID_LENGTH),
];

/**
 * Returns a validation chain for order creation.
 * @returns {ValidationChain[]} - Validation chain.
 */
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

/**
 * Returns a validation chain for order deletion.
 * @returns {ValidationChain[]} - Validation chain.
 */
const orderDeletionRules = () => {
  return [
    check("customerId")
      .notEmpty()
      .withMessage(validationErrorMessages.CUSTOMER_ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.CUSTOMER_ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.CUSTOMER_ID_LENGTH),
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
  orderDeletionRules,
};
