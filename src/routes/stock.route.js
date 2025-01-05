/**
 * Stock routes.
 * @module routes/stock
 */
const express = require("express");
const router = express.Router();
const authController = require("../auth/authController");
const stockController = require("../controllers/stock.controller");

/**
 * Route for stock creation.
 * @memberof module:routes/stock
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware
 * @param {Array} stockController.createStock - Contains ValidationChain and new stock creation logic.
 */
router.post("/stocks", authController.verifyToken, stockController.createStock);

/**
 * Route for stock update.
 * @memberof module:routes/stock
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware
 * @param {Array} stockController.updateStock - Contains ValidationChain and stock update logic.
 */
router.put("/stocks", authController.verifyToken, stockController.updateStock);

/**
 * Route for stock deletion.
 * @memberof module:routes/stock
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware
 * @param {Array} stockController.deleteStock - Contains ValidationChain and
 * stock deletion logic.
 */
router.delete(
  "/stocks",
  authController.verifyToken,
  stockController.deleteStock
);

module.exports = { router };
