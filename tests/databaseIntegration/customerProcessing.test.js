const mongoose = require("mongoose");
const {
  createCustomer,
  updateCustomerInfo,
  deleteCustomer,
} = require("../../src/controllers/customer.controller");
const { create } = require("../../src/controllers/user.controller");
const Customer = require("../../src/models/customer.model");
const User = require("../../src/models/user.model");
const responseMessages = require("../../src/resources/responseMessages");
require("dotenv").config();

describe("Customer processing integration test(s)", () => {
  let res, next;

  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterAll(async () => {
    await Customer.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test("new user created (201)", async () => {
    const req = {
      body: {
        username: "newUser",
        email: "myNew@mail.com",
        password: "OD8y!_$esDuw$jK",
        role: "customer",
      },
    };

    for (let middleware of create) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.USER_REGISTERED,
    });
  });

  test("customer added (201)", async () => {
    const req = {
      body: {
        firstName: "Sofia",
        lastName: "Pollard",
        phoneNumber: "620-763-3940",
        city: "Athens",
        streetAddress: "Acropolis 1",
        zipCode: "11746",
        customerType: "retail",
        username: "newUser",
      },
    };

    for (let middleware of createCustomer) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.CUSTOMER_ADDED,
    });
  });

  test("customer updated (201)", async () => {
    const customerToUpdate = await Customer.findOne({
      username: "newUser",
    });

    const req = {
      body: {
        id: customerToUpdate._id.toString(),
        city: "London",
      },
    };

    for (let middleware of updateCustomerInfo) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.CUSTOMER_UPDATED,
    });
  });

  test("customer deleted (204)", async () => {
    const customerToDelete = await Customer.findOne({
      username: "newUser",
    });

    const req = {
      body: {
        id: customerToDelete._id.toString(),
      },
    };

    for (let middleware of deleteCustomer) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
