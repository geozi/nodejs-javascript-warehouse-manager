const Stock = require("../../src/models/stock.model");
const { deleteStock } = require("../../src/controllers/stock.controller");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Stock deletion integration tests", () => {
  let req, res, next;

  const input = {
    productId: "67710722913928977aa04ea0",
  };

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Stock.findOneAndDelete = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("deleted (204)", () => {
    test("with valid productId", async () => {
      req = { body: { productId: input.productId } };

      for (let middleware of deleteStock) {
        await middleware(req, res, next);
      }

      expect(Stock.findOneAndDelete.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(204);
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

        for (let middleware of deleteStock) {
          await middleware(req, res, next);
        }

        expect(Stock.findOneAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.PRODUCT_ID_REQUIRED },
            { message: validationErrorMessages.PRODUCT_ID_INVALID },
            { message: validationErrorMessages.PRODUCT_ID_LENGTH },
          ],
        });
      });
    });

    const productIdLengthCases = [
      ["with too short productId", "67710722913928977"],
      [
        "with too long productId",
        "67710722913928977aa04ea067710722913928977aa04ea0",
      ],
    ];

    productIdLengthCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.productId = invalidInput;

        for (let middleware of deleteStock) {
          await middleware(req, res, next);
        }

        expect(Stock.findOneAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_ID_LENGTH }],
        });
      });
    });

    const productIdInvalidCases = [
      ["with productId containing special symbols", "67*db12ed*29a1*ed143e37e"],
      ["with productId containing white spaces", "6771 722 13928977aa04ea0"],
      ["with productId containing capital letters", "67710722913928977AA04ea0"],
    ];

    productIdInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.productId = invalidInput;

        for (let middleware of deleteStock) {
          await middleware(req, res, next);
        }

        expect(Stock.findOneAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_ID_INVALID }],
        });
      });
    });
  });
});
