/**
 * Order routes.
 * @module src/routes/order
 */
const express = require("express");
const orderRouter = express.Router();
const authController = require("../auth/authController");
const orderController = require("../controllers/order.controller");

/**
 * Route for creating orders.
 * @memberof module:src/routes/order
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} orderController.createOrder - Contains ValidationChain and order creation logic.
 */
orderRouter.post("/", authController.verifyToken, orderController.createOrder);

/**
 * Route for deleting orders.
 * @memberof module:src/routes/order
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} orderController.deleteOrder - Contains ValidationChain and order deletion logic.
 */
orderRouter.delete(
  "/",
  authController.verifyToken,
  orderController.deleteOrder
);

module.exports = { orderRouter };
