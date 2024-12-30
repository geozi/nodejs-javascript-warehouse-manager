const Order = require("../models/order.model");
const { orderCreationRules } = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");

/**
 * Handles new order creation requests.
 *
 * When the createOrder is used, the Express ValidationChain path
 * is executed first, running all middleware functions responsible for the
 * validation of new order creation requests. If the validation passes
 * successfully, it proceeds to the main method which handles order creations.
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

      const newOrder = new Order({
        customerId: customerId,
        products: products,
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

      res.status(201).json(responseMessages.ORDER_CREATED);
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

module.exports = { createOrder };
