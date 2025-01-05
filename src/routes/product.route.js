/**
 * Product routes.
 * @module routes/product
 */
const express = require("express");
const router = express.Router();
const authController = require("../auth/authController");
const productController = require("../controllers/product.controller");

/**
 * Route for adding products.
 * @memberof module:routes/product
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} productController.createProduct - Contains ValidationChain and product addition logic.
 */
router.post(
  "/products",
  authController.verifyToken,
  productController.createProduct
);

/**
 * Route for updating product info.
 * @memberof module:routes/product
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} productController.updateProduct - Contains ValidationChain and product info update logic.
 */
router.put(
  "/products",
  authController.verifyToken,
  productController.updateProduct
);

/**
 * Route for deleting product info.
 * @memberof module:routes/product
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} productController.deleteProduct - Contains ValidationChain and product info deletion logic.
 */
router.delete(
  "/products",
  authController.verifyToken,
  productController.deleteProduct
);

module.exports = { router };
