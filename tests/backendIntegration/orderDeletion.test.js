const Order = require("../../src/models/order.model");
const { deleteOrder } = require("../../src/controllers/order.controller");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Order deletion integration tests", () => {
  let req, res, next;
  const validId = "67710722913928977aa04ea0";

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Order.findOneAndDelete = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("deleted (204)", () => {
    test("with valid customerId", async () => {
      req = { body: { customerId: validId } };

      for (let middleware of deleteOrder) {
        await middleware(req, res, next);
      }

      expect(Order.findOneAndDelete.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe("bad request (400)", () => {
    const customerIdRequiredCases = [
      [
        "with undefined customerId",
        {
          customerId: undefined,
        },
      ],
      ["with null customerId", { customerId: null }],
    ];

    customerIdRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of deleteOrder) {
          await middleware(req, res, next);
        }

        expect(Order.findOneAndDelete).not.toHaveBeenCalled();
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

    const customerIdLengthCases = [
      [
        "with too short customerId",
        {
          customerId: "67710722913928977",
        },
      ],
      [
        "with too long customerId",
        {
          customerId: "67710722913928977aa04ea067710722913928977aa04ea0",
        },
      ],
    ];

    customerIdLengthCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of deleteOrder) {
          await middleware(req, res, next);
        }

        expect(Order.findOneAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_ID_LENGTH }],
        });
      });
    });

    const customerIdInvalidCases = [
      [
        "with customerId containing special symbols",
        {
          customerId: "67*db12ed*29a1*ed143e37e",
        },
      ],
      [
        "with customerId containing white spaces",
        {
          customerId: "6771 722 13928977aa04ea0",
        },
      ],
      [
        "with customerId containing capital letters",
        {
          customerId: "67710722913928977AA04ea0",
        },
      ],
    ];

    customerIdInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of deleteOrder) {
          await middleware(req, res, next);
        }

        expect(Order.findOneAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_ID_INVALID }],
        });
      });
    });
  });
});