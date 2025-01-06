/**
 * Order controller functions.
 * @module src/controllers/order
 */

const Order = require("../models/order.model");
const {
  orderCreationRules,
  orderDeletionRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");
const { default: mongoose } = require("mongoose");

/**
 * Middleware array that contains new order creation logic.
 *
 * @memberof module:src/controllers/order
 * @type {Array<Function>}
 * @property {Array<Function>} orderCreationRules - Express validation rules for order creation.
 * @property {Function} anonymousAsyncFunction - Handles new order creation requests and responses.
 *
 */
const createOrder = [
  ...orderCreationRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const {
        customerId,
        products,
        orderDate,
        totalNumberOfUnits,
        totalCost,
        shippingAddress,
        billingAddress,
        status,
        shippingMethod,
        paymentMethod,
      } = req.body;

      const customerIdAsObjectId = new mongoose.Types.ObjectId(customerId);
      const productsAsObjectIds = products.map(
        (idAsString) => new mongoose.Types.ObjectId(idAsString)
      );

      const newOrder = new Order({
        customerId: customerIdAsObjectId,
        products: productsAsObjectIds,
        orderDate: orderDate,
        totalNumberOfUnits: totalNumberOfUnits,
        totalCost: totalCost,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        status: status,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
      });

      await newOrder.save();

      res.status(201).json({ message: responseMessages.ORDER_CREATED });
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
 * Middleware array that contains order deletion requests.
 *
 * @memberof module:src/controllers/order
 * @type {Array<Function>}
 * @property {Array<Function>} orderDeletionRules - Express validation rules for order deletion.
 * @property {Function} anonymousAsyncFunction - Handles order deletion requests and responses.
 *
 */
const deleteOrder = [
  ...orderDeletionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { customerId } = req.body;
      const customerIdAsObjectId = new mongoose.Types.ObjectId(customerId);
      const deletedOrder = await Order.findOneAndDelete({
        customerId: customerIdAsObjectId,
      });

      if (deletedOrder === null) {
        return res
          .status(404)
          .json({ message: responseMessages.ORDER_NOT_FOUND });
      }

      return res.status(204).json({});
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

module.exports = { createOrder, deleteOrder };
