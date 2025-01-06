/**
 * Customer routes.
 * @module routes/customer
 */
const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customer.controller");
const authController = require("../auth/authController");

/**
 * Route for adding customers.
 * @memberof module:routes/customer
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} customerController.createCustomer - Contains ValidationChain and new customer addition logic.
 */
customerRouter.post(
  "/",
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
customerRouter.put(
  "/",
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
customerRouter.delete(
  "/",
  authController.verifyToken,
  customerController.deleteCustomer
);

module.exports = { customerRouter };
