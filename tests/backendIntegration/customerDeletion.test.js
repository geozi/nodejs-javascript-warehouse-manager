const Customer = require("../../src/models/customer.model");
const { deleteCustomer } = require("../../src/controllers/customer.controller");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Customer deletion integration tests", () => {
  let req, res, next;
  const validId = "67710722913928977aa04ea0";

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Customer.findByIdAndDelete = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("deleted (204)", () => {
    test("with valid id", async () => {
      req = {
        body: {
          id: validId,
        },
      };

      for (let middleware of deleteCustomer) {
        await middleware(req, res, next);
      }

      expect(Customer.findByIdAndDelete.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe("bad request (400)", () => {
    const idRequiredCases = [
      [
        "with undefined id",
        {
          id: undefined,
        },
      ],
      ["with null id", { id: null }],
    ];

    idRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of deleteCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.CUSTOMER_ID_REQUIRED },
            { message: validationErrorMessages.CUSTOMER_ID_INVALID },
            { message: validationErrorMessages.CUSTOMER_ID_LENGTH },
          ],
        });
      });
    });

    const idLengthCases = [
      [
        "with too short id",
        {
          id: "67710722913928977",
        },
      ],
      [
        "with too long id",
        {
          id: "67710722913928977aa04ea067710722913928977aa04ea0",
        },
      ],
    ];

    idLengthCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of deleteCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_ID_LENGTH }],
        });
      });
    });

    const idInvalidCases = [
      [
        "with id containing special symbols",
        {
          id: "67*db12ed*29a1*ed143e37e",
        },
      ],
      [
        "with id containing white spaces",
        {
          id: "6771 722 13928977aa04ea0",
        },
      ],
      [
        "with id containing capital letters",
        {
          id: "67710722913928977AA04ea0",
        },
      ],
    ];

    idInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of deleteCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_ID_INVALID }],
        });
      });
    });
  });
});
