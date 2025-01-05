/**
 * Customer routes.
 * @module routes/customer
 */
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const authController = require("../auth/authController");

/**
 * Route for adding customers.
 * @memberof module:routes/customer
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} customerController.createCustomer - Contains ValidationChain and new customer addition logic.
 */
router.post(
  "/customers",
  authController.verifyToken,
  customerController.createCustomer
);

/**
 * Route for updating customer info.
 * @memberof module:routes/customer
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} customerController.updateCustomerInfo - Contains ValidationChain and customer info update logic.
 */
router.put(
  "/customers",
  authController.verifyToken,
  customerController.updateCustomerInfo
);

/**
 * Route for deleting customer info.
 * @memberof module:routes/customer
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} customerController.deleteCustomer - Contains ValidationChain and customer info deletion logic.
 */
router.delete(
  "/customers",
  authController.verifyToken,
  customerController.deleteCustomer
);

module.exports = { router };
