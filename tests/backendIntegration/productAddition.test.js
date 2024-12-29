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
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.PRODUCT_ADDED,
      });
    });
  });

  describe("bad request (400)", () => {
    const nameInvalidCases = [
      [
        "with undefined name",
        {
          name: undefined,
          price: validPrice,
          category: validCategory,
        },
      ],
      [
        "with null name",
        {
          name: null,
          price: validPrice,
          category: validCategory,
        },
      ],
    ];

    nameInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined price",
        {
          name: validName,
          price: undefined,
          category: validCategory,
        },
      ],
      [
        "with null price",
        {
          name: validName,
          price: null,
          category: validCategory,
        },
      ],
    ];

    priceRequiredCases.forEach(([testName, input]) => [
      test(testName, async () => {
        req = { body: input };

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
      [
        "with price containing letters",
        {
          name: validName,
          price: "12a",
          category: validCategory,
        },
      ],
      [
        "with price containing symbols",
        {
          name: validName,
          price: "12-1",
          category: validCategory,
        },
      ],
      [
        "with price containing white spaces",
        {
          name: validName,
          price: "12 8",
          category: validCategory,
        },
      ],
    ];

    priceInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined category",
        {
          name: validName,
          price: validPrice,
          category: undefined,
        },
      ],
      [
        "with null category",
        {
          name: validName,
          price: validPrice,
          category: null,
        },
      ],
    ];

    categoryRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      req = {
        body: {
          name: undefined,
          price: validPrice,
          category: undefined,
        },
      };

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
      req = {
        body: {
          name: validName,
          price: null,
          category: null,
        },
      };

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
      req = {
        body: {
          name: undefined,
          price: null,
          category: validCategory,
        },
      };

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
