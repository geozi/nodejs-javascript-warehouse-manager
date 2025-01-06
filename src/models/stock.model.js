/**
 * Stock schema.
 * @module src/models/stock
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");

/**
 * Stock schema for persistence in MongoDB.
 *
 * @memberof module:src/models/stock
 * @type {mongoose.Schema<Stock>}
 * @typedef {Object} Stock
 * @property {mongoose.Schema.Types.ObjectId} productId - The ID of the product to which the stock refers.
 * @property {Number} numberOfUnits - The number of units in the stock.
 */
const stockSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, validationErrorMessages.PRODUCT_ID_REQUIRED],
      unique: [true, validationErrorMessages.PRODUCT_ID_UNIQUE],
    },
    numberOfUnits: {
      type: Number,
      required: [true, validationErrorMessages.UNIT_NUMBER_REQUIRED],
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: validationErrorMessages.UNIT_NUMBER_NEGATIVE,
      },
    },
  },
  {
    collection: "stocks",
    timestamps: true,
  }
);

stockSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Stock", stockSchema);
