/**
 * Order model units tests.
 */

const Order = require("../../src/models/order.model");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Order model unit tests", () => {
  describe("new order test", () => {
    const validInput = {
      customerId: new mongoose.Types.ObjectId("676ebb16ef1902e59f440af8"),
      products: [
        new mongoose.Types.ObjectId("676ebc4f4c7fe8bc98eb8142"),
        new mongoose.Types.ObjectId("676ebc5d4b3523f3fa29559f"),
        new mongoose.Types.ObjectId("676ebc6946f5a33e21734847"),
      ],
      orderDate: new Date(),
      totalNumberOfUnits: 2,
      totalCost: 95,
      shippingAddress: "Acropolis 1, Athens",
      billingAddress: "Acropolis 1, Athens",
      status: "Pending",
      shippingMethod: "Standard",
      paymentMethod: "Credit/Debit card",
    };

    beforeAll(() => {
      mockingoose(Order);
    });

    afterAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newOrder = new Order(validInput);

      const err = newOrder.validateSync();
      expect(err).toBeUndefined();
    });

    test("with empty product list", () => {
      const newOrder = new Order(validInput);
      newOrder.products = [];
      const err = newOrder.validateSync();

      expect(err.errors.products).toBeDefined();
      expect(err.errors.products.message).toBe(
        validationErrorMessages.PRODUCT_ITEMS_REQUIRED
      );
    });

    test("with totalNumberOfUnits = 0", () => {
      const newOrder = new Order(validInput);
      newOrder.totalNumberOfUnits = 0;
      const err = newOrder.validateSync();

      expect(err.errors.totalNumberOfUnits).toBeDefined();
      expect(err.errors.totalNumberOfUnits.message).toBe(
        validationErrorMessages.TOTAL_UNIT_NUMBER_ABOVE_ZERO
      );
    });

    test("with totalCost = 0", () => {
      const newOrder = new Order(validInput);
      newOrder.totalCost = 0;
      const err = newOrder.validateSync();

      expect(err.errors.totalCost).toBeDefined();
      expect(err.errors.totalCost.message).toBe(
        validationErrorMessages.TOTAL_COST_ABOVE_ZERO
      );
    });

    test("with invalid status", () => {
      const newOrder = new Order(validInput);
      newOrder.status = "Ready";
      const err = newOrder.validateSync();

      expect(err.errors.status).toBeDefined();
      expect(err.errors.status.message).toBe(
        validationErrorMessages.STATUS_INVALID
      );
    });

    test("with invalid shippingMethod", () => {
      const newOrder = new Order(validInput);
      newOrder.shippingMethod = "Fast";
      const err = newOrder.validateSync();

      expect(err.errors.shippingMethod).toBeDefined();
      expect(err.errors.shippingMethod.message).toBe(
        validationErrorMessages.SHIPPING_METHOD_INVALID
      );
    });

    test("with invalid paymentMethod", () => {
      const newOrder = new Order(validInput);
      newOrder.paymentMethod = "Coins";
      const err = newOrder.validateSync();

      expect(err.errors.paymentMethod).toBeDefined();
      expect(err.errors.paymentMethod.message).toBe(
        validationErrorMessages.PAYMENT_METHOD_INVALID
      );
    });
  });
});
