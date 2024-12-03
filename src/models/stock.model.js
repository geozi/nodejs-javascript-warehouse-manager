/**
 * The Stock model schema will allow for
 * the filling of a separate stock
 * counting collection in the database.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    numberOfUnits: Number,
  },
  {
    collection: "Stocks",
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", stockSchema);
