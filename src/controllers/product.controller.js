/**
 * Product controller functions.
 * @module src/controllers/product
 */

const Product = require("../models/product.model");
const {
  productAdditionRules,
  productUpdateRules,
  productDeletionRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");
const { default: mongoose } = require("mongoose");

/**
 * Middleware array that contains new product addition logic.
 *
 * @memberof module:src/controllers/product
 * @type {Array<Function>}
 * @property {Array<Function>} productAdditionRules - Express validation rules for new product addition.
 * @property {Function} anonymousAsyncFunction - Handles new product addition requests and responses.
 *
 */
const createProduct = [
  ...productAdditionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { name, price, category } = req.body;

      const newProduct = new Product({
        name: name,
        price: price,
        category: category,
      });

      await newProduct.save();
      res.status(201).json({ message: responseMessages.PRODUCT_ADDED });
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
 * Middleware array that contains product info update logic.
 *
 * @memberof module:src/controllers/product
 * @type {Array<Function>}
 * @property {Array<Function>} productUpdateRules - Express validation rules for product info update.
 * @property {Function} anonymousAsyncFunction - Handles product info update requests and responses.
 *
 */
const updateProduct = [
  ...productUpdateRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id, name, price, category } = req.body;
      const idAsObjectId = new mongoose.Types.ObjectId(id);

      const productToUpdate = {
        name: name,
        price: price,
        category: category,
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        idAsObjectId,
        productToUpdate,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (updatedProduct === null) {
        return res
          .status(404)
          .json({ message: responseMessages.PRODUCT_NOT_FOUND });
      }

      return res
        .status(201)
        .json({ message: responseMessages.PRODUCT_UPDATED });
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
 * Middleware array that contains product deletion logic.
 *
 * @memberof module:src/controllers/product
 * @type {Array<Function>}
 * @property {Array<Function>} productDeletionRules - Express validation rules for product deletion.
 * @property {Function} anonymousAsyncFunction - Handles product deletion requests and responses.
 *
 */
const deleteProduct = [
  ...productDeletionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id } = req.body;
      const idAsObjectId = new mongoose.Types.ObjectId(id);
      const deletedProduct = await Product.findByIdAndDelete(idAsObjectId);

      if (deletedProduct === null) {
        return res
          .status(404)
          .json({ message: responseMessages.PRODUCT_NOT_FOUND });
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

module.exports = { createProduct, updateProduct, deleteProduct };
