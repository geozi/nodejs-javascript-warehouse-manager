const Order = require("../../src/models/order.model");
const { createOrder } = require("../../src/controllers/order.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Order creation integration tests", () => {
  let req, res, next;

  const input = {
    customerId: "676ebb16ef1902e59f440af8",
    products: [
      "676ebc4f4c7fe8bc98eb8142",
      "676ebc5d4b3523f3fa29559f",
      "676ebc6946f5a33e21734847",
    ],
    orderDate: new Date(),
    totalNumberOfUnits: 2,
    totalCost: 95,
    shippingAddress: "Acropolis 1, Athens",
    billingAddress: "Acropolis 1, Athens",
    status: "Pending",
    shippingMethod: "Standard",
    paymentMethod: "Credit/Debit card",
  };

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Order.prototype.save = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("created (201)", () => {
    test("with valid fields", async () => {
      req = { body: input };

      for (let middleware of createOrder) {
        await middleware(req, res, next);
      }

      expect(Order.prototype.save.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.ORDER_CREATED,
      });
    });
  });

  describe("bad request (400)", () => {
    const customerIdInvalidCases = [
      ["with undefined customerId", undefined],
      ["with null customerId", null],
    ];

    customerIdInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.customerId = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_ID_REQUIRED }],
        });
      });
    });

    const productsRequiredCases = [
      ["with undefined products", undefined],
      ["with null products", null],
    ];

    productsRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.products = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PRODUCT_ITEMS_REQUIRED }],
        });
      });
    });

    const orderDateRequiredCases = [
      ["with undefined orderDate", undefined],
      ["with null orderDate", null],
    ];

    orderDateRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.orderDate = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.ORDER_DATE_REQUIRED }],
        });
      });
    });

    const totalUnitNumberRequiredCases = [
      ["with undefined totalNumberOfUnits", undefined],
      ["with null totalNumberOfUnits", null],
    ];

    totalUnitNumberRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.totalNumberOfUnits = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.TOTAL_UNIT_NUMBER_REQUIRED },
            { message: validationErrorMessages.TOTAL_UNIT_NUMBER_NUMERIC },
          ],
        });
      });
    });

    const totalUnitNumberInvalidCases = [
      ["with totalNumberOfUnits containing letter(s)", "1b"],
      ["with totalNumberOfUnits containing symbol(s)", "123*1-"],
      ["with totalNumberOfUnits containing white spaces", " 2 1"],
    ];

    totalUnitNumberInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.totalNumberOfUnits = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.TOTAL_UNIT_NUMBER_NUMERIC },
          ],
        });
      });
    });

    const totalCostRequiredCases = [
      ["with undefined totalCost", undefined],
      ["with null totalCost", null],
    ];

    totalCostRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.totalCost = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.TOTAL_COST_REQUIRED },
            { message: validationErrorMessages.TOTAL_COST_NUMERIC },
          ],
        });
      });
    });

    const totalCostInvalidCases = [
      ["with totalCost containing letter(s)", "9a8"],
      ["with totalCost containing symbol(s)", "-9*8^"],
      ["with totalCost containing white space(s)", "9 8"],
    ];

    totalCostInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.totalCost = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.TOTAL_COST_NUMERIC }],
        });
      });
    });

    const shippingAddressRequiredCases = [
      ["with undefined shippingAddress", undefined],
      ["with null shippingAddress", null],
    ];

    shippingAddressRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.shippingAddress = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.SHIPPING_ADDRESS_REQUIRED },
          ],
        });
      });
    });

    const billingAddressRequiredCases = [
      ["with undefined billingAddress", undefined],
      ["with null billingAddress", null],
    ];

    billingAddressRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.billingAddress = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.BILLING_ADDRESS_REQUIRED },
          ],
        });
      });
    });

    const statusRequiredCases = [
      ["with undefined status", undefined],
      ["with null status", null],
    ];

    statusRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.status = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.STATUS_REQUIRED }],
        });
      });
    });

    const shippingMethodRequiredCases = [
      ["with undefined shippingMethod", undefined],
      ["with null shippingMethod", null],
    ];

    shippingMethodRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.shippingMethod = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.SHIPPING_METHOD_REQUIRED },
          ],
        });
      });
    });

    const paymentMethodRequiredCases = [
      ["with undefined paymentMethod", undefined],
      ["with null paymentMethod", null],
    ];

    paymentMethodRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.paymentMethod = invalidInput;

        for (let middleware of createOrder) {
          await middleware(req, res, next);
        }

        expect(Order.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.PAYMENT_METHOD_REQUIRED },
          ],
        });
      });
    });
  });
});
