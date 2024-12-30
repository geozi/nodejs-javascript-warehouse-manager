const Stock = require("../models/stock.model");
const {
  stockCreationRules,
  stockUpdateRules,
  stockDeletionRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");

/**
 * Handles stock creation requests.
 *
 * When the createStock is used, the Express ValidationChain path
 * is executed first, running all middleware functions responsible for the
 * validation of new stock creation requests. If the validation passes
 * successfully, it proceeds to the main method which handles new
 * stock creation.
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

      const newStock = new Stock({
        productId: productId,
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
 * Handles stock update requests.
 *
 * When the updateStock is used, the Express ValidationChain path
 * is executed first, running all middleware functions responsible for
 * the validation of stock update requests. If the validation passes
 * successfully, it proceeds to the main method which handles stock
 * updates.
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

      const stockToUpdate = new Stock({
        productId: productId,
        numberOfUnits: numberOfUnits,
      });

      const updatedStock = await Stock.findOneAndUpdate(
        { productId: productId },
        stockToUpdate,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (!updatedStock) {
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
 * Handles stock deletion requests.
 *
 * When the deleteStock is used, the Express ValidationChain path
 * is executed first, running all middleware functions responsible for
 * the validation of stock deletion requests. If the validation passes
 * successfully, it proceeds to the main method which handles stock
 * deletions.
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
      const deletedStock = await Stock.findOneAndDelete({
        productId: productId,
      });

      if (!deletedStock) {
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
