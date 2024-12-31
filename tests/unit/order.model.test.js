/**
 * Order model units tests.
 */

const Order = require("../../src/models/order.model");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Order model unit tests", () => {
  describe("new order test", () => {
    beforeAll(() => {
      mockingoose.resetAll();
    });

    const validCustomerId = new mongoose.Types.ObjectId(
      "676ebb16ef1902e59f440af8"
    );
    const validProductList = [
      new mongoose.Types.ObjectId("676ebc4f4c7fe8bc98eb8142"),
      new mongoose.Types.ObjectId("676ebc5d4b3523f3fa29559f"),
      new mongoose.Types.ObjectId("676ebc6946f5a33e21734847"),
    ];
    const validOrderDate = new Date();
    const validTotalNumberOfUnits = 2;
    const validTotalCost = 95;
    const validShippingAddress = "Akropolis 1, Athens";
    const validBillingAddress = "Akropolis 1, Athens";
    const validStatus = "Pending";
    const validShippingMethod = "Standard";
    const validPaymentMethod = "Credit/Debit card";

    test("with valid fields", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });

      const err = newOrder.validateSync();
      expect(err).toBeUndefined();
    });

    test("with empty product list", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: [],
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(err.errors.products).toBeDefined();
      expect(err.errors.products.message).toBe(
        validationErrorMessages.PRODUCT_ITEMS_REQUIRED
      );
    });

    test("with totalNumberOfUnits = 0", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: 0,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(err.errors.totalNumberOfUnits).toBeDefined();
      expect(err.errors.totalNumberOfUnits.message).toBe(
        validationErrorMessages.TOTAL_UNIT_NUMBER_ABOVE_ZERO
      );
    });

    test("with totalCost = 0", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: 0,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });

      const err = newOrder.validateSync();

      expect(err.errors.totalCost).toBeDefined();
      expect(err.errors.totalCost.message).toBe(
        validationErrorMessages.TOTAL_COST_ABOVE_ZERO
      );
    });

    test("with invalid status", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: "Ready",
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(err.errors.status).toBeDefined();
      expect(err.errors.status.message).toBe(
        validationErrorMessages.STATUS_INVALID
      );
    });

    test("with invalid shippingMethod", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: "Fast",
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(err.errors.shippingMethod).toBeDefined();
      expect(err.errors.shippingMethod.message).toBe(
        validationErrorMessages.SHIPPING_METHOD_INVALID
      );
    });

    test("with invalid paymentMethod", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: "Coins",
      });
      const err = newOrder.validateSync();

      expect(err.errors.paymentMethod).toBeDefined();
      expect(err.errors.paymentMethod.message).toBe(
        validationErrorMessages.PAYMENT_METHOD_INVALID
      );
    });
  });
});
