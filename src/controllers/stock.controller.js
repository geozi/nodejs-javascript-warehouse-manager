const Stock = require("../models/stock.model");
const { stockCreationRules } = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");

/**
 * Handles stock creation requests.
 *
 * When the createStock method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of new stock creation requests. If the validation
 * passes successfully, it proceeds to the main logic of the method which
 * handles new stock creation.
 */
const createStock = [
  ...stockCreationRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
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

module.exports = { createStock };
