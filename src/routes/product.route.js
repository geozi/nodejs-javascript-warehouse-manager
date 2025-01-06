/**
 * Product routes.
 * @module src/routes/product
 */
const express = require("express");
const productRouter = express.Router();
const authController = require("../auth/authController");
const productController = require("../controllers/product.controller");

/**
 * Route for adding products.
 * @memberof module:src/routes/product
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} productController.createProduct - Contains ValidationChain and product addition logic.
 */
productRouter.post(
  "/",
  authController.verifyToken,
  productController.createProduct
);

/**
 * Route for updating product info.
 * @memberof module:src/routes/product
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} productController.updateProduct - Contains ValidationChain and product info update logic.
 */
productRouter.put(
  "/",
  authController.verifyToken,
  productController.updateProduct
);

/**
 * Route for deleting product info.
 * @memberof module:src/routes/product
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware.
 * @param {Array} productController.deleteProduct - Contains ValidationChain and product info deletion logic.
 */
productRouter.delete(
  "/",
  authController.verifyToken,
  productController.deleteProduct
);

module.exports = { productRouter };
