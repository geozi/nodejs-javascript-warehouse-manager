const Product = require("../../src/models/product.model");
const { updateProduct } = require("../../src/controllers/product.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Product update integration tests", () => {
  let req, res, next;

  const input = {
    id: "67710722913928977aa04ea0",
    name: "Truck Tool",
    price: 198,
    category: "Automotive",
  };

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Product.findByIdAndUpdate = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("updated (201)", () => {
    const updatedCustomerCases = [
      [
        "with valid ID only",
        {
          id: input.id,
        },
      ],
      ["with valid fields", input],
    ];

    updatedCustomerCases.forEach(([testName, validInput]) => {
      test(testName, async () => {
        req = { body: validInput };

        for (let middleware of updateProduct) {
          await middleware(req, res, next);
        }

        expect(Product.findByIdAndUpdate.mock.calls).toHaveLength(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: responseMessages.PRODUCT_UPDATED,
        });
      });
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

        for (let middleware of updateProduct) {
          await middleware(req, res, next);
        }

        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
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

        for (let middleware of updateProduct) {
          await middleware(req, res, next);
        }

        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
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

        for (let middleware of updateProduct) {
          await middleware(req, res, next);
        }

        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_ID_INVALID }],
        });
      });
    });
  });
});
