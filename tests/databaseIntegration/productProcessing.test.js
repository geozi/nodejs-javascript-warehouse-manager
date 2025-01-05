const mongoose = require("mongoose");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../src/controllers/product.controller");
const Product = require("../../src/models/product.model");
const responseMessages = require("../../src/resources/responseMessages");
require("dotenv").config();

describe.skip("Product processing integration test(s)", () => {
  let res, next;
  const name = "Computer Widget";

  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterAll(async () => {
    await Product.deleteMany({});
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

  test("product updated (201)", async () => {
    const productToUpdate = await Product.findOne({ name: name });

    const req = {
      body: {
        id: productToUpdate._id.toString(),
        price: "100",
      },
    };

    for (let middleware of updateProduct) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: responseMessages.PRODUCT_UPDATED,
    });
  });

  test("product deleted (204)", async () => {
    const productToDelete = await Product.findOne({ name: name });

    const req = {
      body: {
        id: productToDelete._id.toString(),
      },
    };

    for (let middleware of deleteProduct) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
