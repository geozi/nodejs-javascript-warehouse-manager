const mongoose = require("mongoose");
const {
  createOrder,
  deleteOrder,
} = require("../../src/controllers/order.controller");
const Order = require("../../src/models/order.model");
const responseMessages = require("../../src/resources/responseMessages");
require("dotenv").config();

describe("Order processing integration test(s)", () => {
  let res, next;

  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterAll(async () => {
    await Order.deleteMany({});
    mongoose.connection.close();
  });

  test("order created (201)", async () => {
    const req = {
      body: {
        customerId: "677ac4c5f801937190b8a9fb",
        products: ["677ac4e7dcbe126825dafd7c", "677ac4ec3cd151ee30647f54"],
        orderDate: new Date(),
        totalNumberOfUnits: 14,
        totalCost: 135.2,
        shippingAddress: "Acropolis 1",
        billingAddress: "Acropolis 1",
        status: "Pending",
        shippingMethod: "Standard",
        paymentMethod: "Cash",
      },
    };

    for (let middleware of createOrder) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.ORDER_CREATED,
    });
  });

  test("order deleted (204)", async () => {
    const req = {
      body: {
        customerId: "677ac4c5f801937190b8a9fb",
      },
    };

    for (let middleware of deleteOrder) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
