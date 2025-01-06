/**
 * Stock routes.
 * @module src/routes/stock
 */
const express = require("express");
const stockRouter = express.Router();
const authController = require("../auth/authController");
const stockController = require("../controllers/stock.controller");

/**
 * Route for stock creation.
 * @memberof module:src/routes/stock
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware
 * @param {Array} stockController.createStock - Contains ValidationChain and new stock creation logic.
 */
stockRouter.post("/", authController.verifyToken, stockController.createStock);

/**
 * Route for stock update.
 * @memberof module:src/routes/stock
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware
 * @param {Array} stockController.updateStock - Contains ValidationChain and stock update logic.
 */
stockRouter.put("/", authController.verifyToken, stockController.updateStock);

/**
 * Route for stock deletion.
 * @memberof module:src/routes/stock
 * @param {String} path - Express path.
 * @param {Function} authController.verifyToken - Authentication middleware
 * @param {Array} stockController.deleteStock - Contains ValidationChain and
 * stock deletion logic.
 */
stockRouter.delete(
  "/",
  authController.verifyToken,
  stockController.deleteStock
);

module.exports = { stockRouter };
