/**
 * The Order schema corresponds to the basket
 * utility of the frontend.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  orderDate: { type: Date, default: Date.now },
  totalNumberOfUnits: { type: Number },
  totalCost: { type: Number },
  shippingAddress: { type: String },
  billingAddress: { type: String },
  status: {
    type: String,
    enum: { values: ["pending", "shipped", "delivered", "canceled"] },
  },
  shippingMethod: {
    type: String,
    enum: { values: ["standard", "express"] },
  },
  paymentMethod: {
    type: String,
    enum: { values: ["Credit/Debit card", "Cash"] },
  },
  creditCard: {
    type: String,
  },
});

module.exports = mongoose.Schema("Order", orderSchema);
