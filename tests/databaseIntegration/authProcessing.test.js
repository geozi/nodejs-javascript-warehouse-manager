const mongoose = require("mongoose");
const { login } = require("../../src/auth/authController");
const { create } = require("../../src/controllers/user.controller");
const User = require("../../src/models/user.model");
require("dotenv").config();

describe.skip("Auth processing integration tests", () => {
  let res, next;

  beforeAll(async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    const createTestUserReq = {
      body: {
        username: "admin",
        email: "email@random.com",
        password: "Dg2&ysPrc3Lol4o",
        role: "admin",
      },
    };

    for (let middleware of create) {
      await middleware(createTestUserReq, res, next);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test("logged in (200)", async () => {
    const req = {
      body: {
        username: "admin",
        password: "Dg2&ysPrc3Lol4o",
      },
    };

    for (let middleware of login) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String) })
    );
  });
});
