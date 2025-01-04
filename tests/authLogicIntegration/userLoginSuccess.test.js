const User = require("../../src/models/user.model");
const bcrypt = require("bcryptjs");
const { login } = require("../../src/auth/authController");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

describe("Successful login integration test", () => {
  let req, res, next;

  const validUsername = "newUser";
  const validEmail = "random@mail.com";
  const validPassword = "W;Vj(+C8Sgqo'_4";
  const validRole = "customer";

  const userFound = new User({
    id: new mongoose.Types.ObjectId("67794ce0cd23fbb2ce77d982"),
    username: validUsername,
    email: validEmail,
    password: validPassword,
    role: validRole,
  });

  const testToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld1VzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.6X6NKeg86aa_8fjqOnI0iGsANvBUgBDBqV4Mc6Kiigg";

  beforeEach(() => {
    jwt.sign = jest.fn().mockReturnValue(testToken);
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({
        token: testToken,
      }),
    };
    next = jest.fn();
    User.findOne = jest.fn().mockResolvedValue(userFound);
    bcrypt.compare = jest.fn().mockReturnValue(true);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("with valid fields", async () => {
    req = {
      body: {
        username: validUsername,
        password: validPassword,
      },
    };

    for (let middleware of login) {
      await middleware(req, res, next);
    }

    expect(User.findOne).toHaveBeenCalled();
    await expect(User.findOne()).resolves.toEqual(userFound);
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveReturnedWith(true);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: testToken,
    });
  });
});
