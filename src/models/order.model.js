/**
 * Order schema.
 * @module src/models/order
 */

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const Schema = mongoose.Schema;

/**
 * Order schema for persistence in MongoDB.
 *
 * @memberof module:src/models/order
 * @type {mongoose.Schema<Order>}
 * @typedef {Object} Order
 * @property {mongoose.Schema.Types.ObjectId} customerId - The ID of the customer.
 * @property {Array<mongoose.Schema.Types.ObjectId>} products - The products ordered by the customer.
 * @property {Date} orderDate - The date the order took place.
 * @property {Number} totalNumberOfUnits - The total number of units of the ordered products.
 * @property {Number} totalCost - The total cost of the order.
 * @property {String} shippingAddress - The shipping address of the customer.
 * @property {String} billingAddress - The billing address of the customer.
 * @property {String} status - The status of the order.
 * @property {String} shippingMethod - The shipping method chosen by the customer.
 * @property {String} paymentMethod - The payment method chosen by the customer.
 *
 */
const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, validationErrorMessages.CUSTOMER_ID_REQUIRED],
      unique: [true, validationErrorMessages.CUSTOMER_ID_UNIQUE],
    },
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      required: [true, validationErrorMessages.PRODUCT_ITEMS_REQUIRED],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: validationErrorMessages.PRODUCT_ITEMS_REQUIRED,
      },
    },
    orderDate: {
      type: Date,
      required: [true, validationErrorMessages.ORDER_DATE_REQUIRED],
    },
    totalNumberOfUnits: {
      type: Number,
      required: [true, validationErrorMessages.TOTAL_UNIT_NUMBER_REQUIRED],
      validate: {
        validator: function (value) {
          return value >= 1;
        },
        message: validationErrorMessages.TOTAL_UNIT_NUMBER_ABOVE_ZERO,
      },
    },
    totalCost: {
      type: Number,
      required: [true, validationErrorMessages.TOTAL_COST_REQUIRED],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: validationErrorMessages.TOTAL_COST_ABOVE_ZERO,
      },
    },
    shippingAddress: {
      type: String,
      required: [true, validationErrorMessages.SHIPPING_ADDRESS_REQUIRED],
    },
    billingAddress: {
      type: String,
      required: [true, validationErrorMessages.BILLING_ADDRESS_REQUIRED],
    },
    status: {
      type: String,
      required: [true, validationErrorMessages.STATUS_REQUIRED],
      enum: {
        values: ["Pending", "Shipped", "Delivered", "Canceled"],
        message: validationErrorMessages.STATUS_INVALID,
      },
    },
    shippingMethod: {
      type: String,
      required: [true, validationErrorMessages.SHIPPING_METHOD_REQUIRED],
      enum: {
        values: ["Standard", "Express"],
        message: validationErrorMessages.SHIPPING_METHOD_INVALID,
      },
    },
    paymentMethod: {
      type: String,
      required: [true, validationErrorMessages.PAYMENT_METHOD_REQUIRED],
      enum: {
        values: ["Credit/Debit card", "Cash"],
        message: validationErrorMessages.PAYMENT_METHOD_INVALID,
      },
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

orderSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Order", orderSchema);
