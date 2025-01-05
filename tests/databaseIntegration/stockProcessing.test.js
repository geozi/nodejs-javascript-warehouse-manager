const mongoose = require("mongoose");
const { createProduct } = require("../../src/controllers/product.controller");
const {
  createStock,
  updateStock,
  deleteStock,
} = require("../../src/controllers/stock.controller");
const responseMessages = require("../../src/resources/responseMessages");
const Stock = require("../../src/models/stock.model");
const Product = require("../../src/models/product.model");
require("dotenv").config();

describe("Stock processing integration test(s)", () => {
  let res, next;
  const name = "Computer Widget";

  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await Stock.deleteMany({});
    await mongoose.connection.close();
  });

  test("product added (201)", async () => {
    const req = {
      body: {
        name: name,
        price: "96",
        category: "Electronics",
      },
    };

    for (let middleware of createProduct) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.PRODUCT_ADDED,
    });
  });

  test("stock created (201)", async () => {
    const productToStock = await Product.findOne({ name: name });
    const productIdAsString = productToStock._id.toString();

    const req = {
      body: {
        productId: productIdAsString,
        numberOfUnits: 0,
      },
    };

    for (let middleware of createStock) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.STOCK_CREATED,
    });
  });

  test("stock updated (201)", async () => {
    const productToStock = await Product.findOne({ name: name });
    const productIdAsString = productToStock._id.toString();

    const req = {
      body: {
        productId: productIdAsString,
        numberOfUnits: 30,
      },
    };

    for (let middleware of updateStock) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.STOCK_UPDATED,
    });
  });

  test("stock deleted (204)", async () => {
    const stockToDelete = await Product.findOne({ name: name });
    const productIdAsString = stockToDelete._id.toString();

    const req = {
      body: {
        productId: productIdAsString,
      },
    };

    for (let middleware of deleteStock) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
