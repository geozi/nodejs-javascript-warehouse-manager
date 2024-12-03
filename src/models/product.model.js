/**
 * The Product model schema is an abstract
 * representation of a product.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMsg = require("../config/validationErrorMsg");

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, validationErrorMsg.PRODUCT_NAME_UNIQUE],
      trim: true,
    },
    price: {
      type: Number,
    },
    salesPrice: {
      type: Number,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

productSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Product", productSchema);
