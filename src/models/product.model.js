const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");

/**
 * Represents a product.
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
