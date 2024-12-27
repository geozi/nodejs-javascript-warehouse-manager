const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const Schema = mongoose.Schema;

/**
 * The Order schema corresponds to the basket
 * utility of the frontend.
 */
const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, validationErrorMessages.CUSTOMER_ID_REQUIRED],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, validationErrorMessages.PRODUCT_ITEMS_REQUIRED],
      },
    ],
    orderDate: {
      type: Date,
      required: [true, validationErrorMessages.ORDER_DATE_REQUIRED],
    },
    totalNumberOfUnits: {
      type: Number,
      required: [true, validationErrorMessages.TOTAL_UNIT_NUMBER_REQUIRED],
      validate: {
        validator: function (value) {
          if (value < 1) {
            return false;
          }
        },
        message: function (props) {
          if (props.value < 1) {
            return validationErrorMessages.TOTAL_UNIT_NUMBER_ABOVE_ZERO;
          }
        },
      },
    },
    totalCost: {
      type: Number,
      required: [true, validationErrorMessages.TOTAL_COST_REQUIRED],
      validate: {
        validator: function (value) {
          if (value <= 0) {
            return false;
          }
        },
        message: function (props) {
          if (props.value <= 0) {
            return validationErrorMessages.TOTAL_COST_ABOVE_ZERO;
          }
        },
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
module.exports = mongoose.Schema("Order", orderSchema);
