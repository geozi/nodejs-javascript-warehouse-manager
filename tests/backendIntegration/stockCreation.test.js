const Stock = require("../../src/models/stock.model");
const { createStock } = require("../../src/controllers/stock.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Stock creation integration tests", () => {
  let req, res, next;

  const input = {
    productId: "677276dcd35754d5bfd42c11",
    numberOfUnits: 1,
  };

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Stock.prototype.save = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("created (201)", () => {
    test("with valid fields", async () => {
      req = { body: input };

      for (let middleware of createStock) {
        await middleware(req, res, next);
      }

      expect(Stock.prototype.save.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.STOCK_CREATED,
      });
    });
  });

  describe("bad request (400)", () => {
    const productIdRequiredCases = [
      ["with undefined productId", undefined],
      ["with null productId", null],
    ];

    productIdRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.productId = invalidInput;

        for (let middleware of createStock) {
          await middleware(req, res, next);
        }

        expect(Stock.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_ID_REQUIRED }],
        });
      });
    });

    const unitNumberRequiredCases = [
      ["with undefined numberOfUnits", undefined],
      ["with null numberOfUnits", null],
    ];

    unitNumberRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.numberOfUnits = invalidInput;

        for (let middleware of createStock) {
          await middleware(req, res, next);
        }

        expect(Stock.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.UNIT_NUMBER_REQUIRED },
            { message: validationErrorMessages.UNIT_NUMBER_NUMERIC },
          ],
        });
      });
    });

    const unitNumberInvalidCases = [
      ["with numberOfUnits containing letter(s)", "1b"],
      ["with numberOfUnits containing special symbols", "*12"],
      ["with numberOfUnits containing white spaces", "15 1"],
    ];

    unitNumberInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.numberOfUnits = invalidInput;

        for (let middleware of createStock) {
          await middleware(req, res, next);
        }

        expect(Stock.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.UNIT_NUMBER_NUMERIC }],
        });
      });
    });

    test("with empty request", async () => {
      req = { body: {} };

      for (let middleware of createStock) {
        await middleware(req, res, next);
      }

      expect(Stock.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.PRODUCT_ID_REQUIRED },
          { message: validationErrorMessages.UNIT_NUMBER_REQUIRED },
          { message: validationErrorMessages.UNIT_NUMBER_NUMERIC },
        ],
      });
    });
  });
});
