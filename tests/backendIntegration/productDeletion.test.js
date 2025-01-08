const Product = require("../../src/models/product.model");
const { deleteProduct } = require("../../src/controllers/product.controller");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Product deletion integration tests", () => {
  let req, res, next;

  const input = {
    id: "67710722913928977aa04ea0",
  };

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Product.findByIdAndDelete = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("deleted (204)", () => {
    test("with valid id", async () => {
      req = { body: { id: input.id } };

      for (let middleware of deleteProduct) {
        await middleware(req, res, next);
      }

      expect(Product.findByIdAndDelete.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe("bad request (400)", () => {
    const idRequiredCases = [
      ["with undefined id", undefined],
      ["with null id", null],
    ];

    idRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = invalidInput;

        for (let middleware of deleteProduct) {
          await middleware(req, res, next);
        }

        expect(Product.findByIdAndDelete).not.toHaveBeenCalled();
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

    const idLengthCases = [
      ["with too short id", "67710722913928977"],
      ["with too long id", "67710722913928977aa04ea067710722913928977aa04ea0"],
    ];

    idLengthCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = invalidInput;

        for (let middleware of deleteProduct) {
          await middleware(req, res, next);
        }

        expect(Product.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_ID_LENGTH }],
        });
      });
    });

    const idInvalidCases = [
      ["with id containing special symbols", "67*db12ed*29a1*ed143e37e"],
      ["with id containing white spaces", "6771 722 13928977aa04ea0"],
      ["with id containing capital letters", "67710722913928977AA04ea0"],
    ];

    idInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.id = invalidInput;

        for (let middleware of deleteProduct) {
          await middleware(req, res, next);
        }

        expect(Product.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_ID_INVALID }],
        });
      });
    });
  });
});
