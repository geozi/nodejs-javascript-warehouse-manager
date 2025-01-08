const Product = require("../../src/models/product.model");
const { createProduct } = require("../../src/controllers/product.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Product addition integration tests", () => {
  let req, res, next;

  const input = {
    name: "Truck Tool",
    price: 198,
    category: "Automotive",
  };

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
      req = { body: input };

      for (let middleware of createProduct) {
        await middleware(req, res, next);
      }

      expect(Product.prototype.save.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.PRODUCT_ADDED,
      });
    });
  });

  describe("bad request (400)", () => {
    const nameInvalidCases = [
      ["with undefined name", undefined],
      ["with null name", null],
    ];

    nameInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.name = invalidInput;

        for (let middleware of createProduct) {
          await middleware(req, res, next);
        }

        expect(Product.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_NAME_REQUIRED }],
        });
      });
    });

    const priceRequiredCases = [
      ["with undefined price", undefined],
      ["with null price", null],
    ];

    priceRequiredCases.forEach(([testName, invalidInput]) => [
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.price = invalidInput;

        for (let middleware of createProduct) {
          await middleware(req, res, next);
        }

        expect(Product.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.PRICE_REQUIRED },
            { message: validationErrorMessages.PRICE_NUMERIC },
          ],
        });
      }),
    ]);

    const priceInvalidCases = [
      ["with price containing letters", "12a"],
      ["with price containing symbols", "12-1"],
      ["with price containing white spaces", "12 8"],
    ];

    priceInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.price = invalidInput;

        for (let middleware of createProduct) {
          await middleware(req, res, next);
        }
        expect(Product.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRICE_NUMERIC }],
        });
      });
    });

    const categoryRequiredCases = [
      ["with undefined category", undefined],
      ["with null category", null],
    ];

    categoryRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.category = invalidInput;

        for (let middleware of createProduct) {
          await middleware(req, res, next);
        }

        expect(Product.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CATEGORY_REQUIRED }],
        });
      });
    });

    test("with 2 undefined fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.name = undefined;
      req.body.category = undefined;

      for (let middleware of createProduct) {
        await middleware(req, res, next);
      }

      expect(Product.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.PRODUCT_NAME_REQUIRED },
          { message: validationErrorMessages.CATEGORY_REQUIRED },
        ],
      });
    });

    test("with 2 null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.price = null;
      req.body.category = null;

      for (let middleware of createProduct) {
        await middleware(req, res, next);
      }

      expect(Product.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.PRICE_REQUIRED },
          { message: validationErrorMessages.PRICE_NUMERIC },
          { message: validationErrorMessages.CATEGORY_REQUIRED },
        ],
      });
    });

    test("with mix of undefined and null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.name = undefined;
      req.body.price = null;

      for (let middleware of createProduct) {
        await middleware(req, res, next);
      }

      expect(Product.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.PRODUCT_NAME_REQUIRED },
          { message: validationErrorMessages.PRICE_REQUIRED },
          { message: validationErrorMessages.PRICE_NUMERIC },
        ],
      });
    });

    test("with empty request", async () => {
      req = { body: {} };

      for (let middleware of createProduct) {
        await middleware(req, res, next);
      }

      expect(Product.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.PRODUCT_NAME_REQUIRED },
          { message: validationErrorMessages.PRICE_REQUIRED },
          { message: validationErrorMessages.PRICE_NUMERIC },
          { message: validationErrorMessages.CATEGORY_REQUIRED },
        ],
      });
    });
  });
});
