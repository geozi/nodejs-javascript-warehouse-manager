const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");

/**
 * Represents the stock of a product.
 */
const stockSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, validationErrorMessages.PRODUCT_ID_REQUIRED],
    },
    numberOfUnits: {
      type: Number,
      required: [true, validationErrorMessages.UNIT_NUMBER_REQUIRED],
      validate: function (value) {
        if (value < 0) {
          return false;
        }
      },
      message: function (props) {
        if (props.value < 0) {
          return validationErrorMessages.UNIT_NUMBER_NEGATIVE;
        }
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
