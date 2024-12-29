const Product = require("../models/product.model");
const {
  productAdditionRules,
  productUpdateRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");

/**
 * Handles new product addition requests.
 *
 * When the createProduct method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of new product addition requests. If the validation
 * passes successfully, it proceeds to the main logic of the method which
 * handles new product addition.
 */
const createProduct = [
  ...productAdditionRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
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
 * Handles product update requests.
 *
 * When the updateProduct method is called, it first executes
 * the ValidationChain path, running all middleware functions responsible
 * for the validation of product update requests. If the validation passes
 * successfully, it proceeds to the main logic of the method which handles
 * product updates.
 */
const updateProduct = [
  ...productUpdateRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id, name, price, category } = req.body;

      const productToUpdate = {
        id: id,
        name: name,
        price: price,
        category: category,
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        productToUpdate,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (!updatedProduct) {
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

module.exports = { createProduct, updateProduct };
