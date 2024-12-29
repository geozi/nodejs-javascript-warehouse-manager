const Product = require("../../src/models/product.model");
const { createProduct } = require("../../src/controllers/product.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Product addition integration tests", () => {
  let req, res, next;

  const validName = "Truck Tool";
  const validPrice = 198;
  const validCategory = "Automotive";

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Product.prototype.save = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("created (201)", () => {
    test("with valid fields", async () => {
      req = {
        body: {
          name: validName,
          price: validPrice,
          category: validCategory,
        },
      };

      for (let middleware of createProduct) {
        await middleware(req, res, next);
      }

      expect(Product.prototype.save.mock.calls).toHaveLength(1);
    });
  });
});
