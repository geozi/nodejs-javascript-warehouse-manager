/**
 * Order routes.
 * @module routes/order
 */
const express = require("express");
const router = express.Router();
const authController = require("../auth/authController");
const orderController = require("../controllers/order.controller");

/**
 * Route for creating orders.
 * @memberof module:routes/order
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} orderController.createOrder - Contains ValidationChain and order creation logic.
 */
router.post("/orders", authController.verifyToken, orderController.createOrder);

/**
 * Route for deleting orders.
 * @memberof module:routes/order
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} orderController.deleteOrder - Contains ValidationChain and order deletion logic.
 */
router.delete(
  "/orders",
  authController.verifyToken,
  orderController.deleteOrder
);

module.exports = { router };