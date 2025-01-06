/**
 * Product schema.
 * @module src/models/product
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");

/**
 * Product schema for persistence in MongoDB.
 *
 * @memberof module:src/models/product
 * @type {mongoose.Schema<Product>}
 * @typedef {Object} Product
 * @property {String} name - The name of the product.
 * @property {Number} price - The price of the product.
 * @property {String} category - The category of the product.
 */
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, validationErrorMessages.PRODUCT_NAME_REQUIRED],
      unique: [true, validationErrorMessages.PRODUCT_NAME_UNIQUE],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, validationErrorMessages.PRICE_REQUIRED],
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: validationErrorMessages.PRICE_NEGATIVE,
      },
    },
    category: {
      type: String,
      required: [true, validationErrorMessages.CATEGORY_REQUIRED],
      enum: {
        values: [
          "Activity",
          "Automotive",
          "Beauty",
          "Clothing",
          "Electronics",
          "Entertainment",
          "Health",
          "Home",
          "Pets",
        ],
        message: validationErrorMessages.CATEGORY_INVALID,
      },
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

productSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Product", productSchema);
