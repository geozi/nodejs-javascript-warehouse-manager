/**
 * Stock controller functions.
 * @module src/controllers/stock
 */

const Stock = require("../models/stock.model");
const {
  stockCreationRules,
  stockUpdateRules,
  stockDeletionRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");
const mongoose = require("mongoose");

/**
 * Middleware array that contains new stock creation logic.
 *
 * @memberof module:src/controllers/stock
 * @type {Array<Object>}
 * @property {ValidationChain[]} stockCreationRules - Express validation rules for new stock creation.
 * @property {Function} anonymousAsyncFunction - Handles new stock creation requests and responses.
 *
 */
const createStock = [
  ...stockCreationRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { productId, numberOfUnits } = req.body;
      const productIdAsObjectId = new mongoose.Types.ObjectId(productId);

      const newStock = new Stock({
        productId: productIdAsObjectId,
        numberOfUnits: numberOfUnits,
      });

      await newStock.save();

      res.status(201).json({ message: responseMessages.STOCK_CREATED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains stock update logic.
 *
 * @memberof module:src/controllers/stock
 * @type {Array<Object>}
 * @property {ValidationChain[]} stockUpdateRules - Express validation rules for stock update.
 * @property {Function} anonymousAsyncFunction - Handles stock update requests and responses.
 *
 */
const updateStock = [
  ...stockUpdateRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { productId, numberOfUnits } = req.body;
      const productIdAsObjectId = new mongoose.Types.ObjectId(productId);

      const stockToUpdate = {
        productId: productIdAsObjectId,
        numberOfUnits: numberOfUnits,
      };

      const updatedStock = await Stock.findOneAndUpdate(
        { productId: productIdAsObjectId },
        stockToUpdate,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (updatedStock === null) {
        return res
          .status(404)
          .json({ message: responseMessages.STOCK_NOT_FOUND });
      }

      return res.status(201).json({ message: responseMessages.STOCK_UPDATED });
    } catch (err) {
      if (err.name == "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Middleware array that contains stock deletion logic.
 *
 * @memberof module:src/controllers/stock
 * @type {Array<Object>}
 * @property {ValidationChain[]} stockDeletionRules - Express validation rules for stock deletion.
 * @property {Function} anonymousAsyncFunction - Handles stock deletion requests and responses.
 *
 */
const deleteStock = [
  ...stockDeletionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { productId } = req.body;
      const productIdAsObjectId = new mongoose.Types.ObjectId(productId);
      const deletedStock = await Stock.findOneAndDelete({
        productId: productIdAsObjectId,
      });

      if (deletedStock === null) {
        return res
          .status(404)
          .json({ message: responseMessages.STOCK_NOT_FOUND });
      }

      return res.status(204).json({});
    } catch (err) {
      if (err.name == "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = { createStock, updateStock, deleteStock };
