const Order = require("../../src/models/order.model");
const { createOrder } = require("../../src/controllers/order.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Order creation integration tests", () => {
  let req, res, next;

  const validCustomerId = "676ebb16ef1902e59f440af8";
  const validProductList = [
    "676ebc4f4c7fe8bc98eb8142",
    "676ebc5d4b3523f3fa29559f",
    "676ebc6946f5a33e21734847",
  ];
  const validOrderDate = new Date();
  const validTotalNumberOfUnits = 2;
  const validTotalCost = 95;
  const validShippingAddress = "Akropolis 1, Athens";
  const validBillingAddress = "Akropolis 1, Athens";
  const validStatus = "Pending";
  const validShippingMethod = "Standard";
  const validPaymentMethod = "Credit/Debit card";

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
      req = {
        body: {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      };

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
      [
        "with undefined customerId",
        {
          customerId: undefined,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null customerId",
        {
          customerId: null,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    customerIdInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined products",
        {
          customerId: validCustomerId,
          products: undefined,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null products",
        {
          customerId: validCustomerId,
          products: null,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    productsRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined orderDate",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: undefined,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null orderDate",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: null,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    orderDateRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined totalNumberOfUnits",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: undefined,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null totalNumberOfUnits",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: null,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    totalUnitNumberRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with totalNumberOfUnits containing letter(s)",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: "1b",
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with totalNumberOfUnits containing symbol(s)",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: "123*1-",
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with totalNumberOfUnits containing white spaces",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: " 2 1",
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    totalUnitNumberInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined totalCost",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: undefined,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null totalCost",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: null,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    totalCostRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with totalCost containing letter(s)",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: "9a8",
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with totalCost containing symbol(s)",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: "-9*8^",
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with totalCost containing white space(s)",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: "9 8",
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    totalCostInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined shippingAddress",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: undefined,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null shippingAddress",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: null,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    shippingAddressRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined billingAddress",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: undefined,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null billingAddress",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: null,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    billingAddressRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined status",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: undefined,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null status",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: null,
          shippingMethod: validShippingMethod,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    statusRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined shippingMethod",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: undefined,
          paymentMethod: validPaymentMethod,
        },
      ],
      [
        "with null shippingMethod",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: null,
          paymentMethod: validPaymentMethod,
        },
      ],
    ];

    shippingMethodRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "with undefined paymentMethod",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: undefined,
        },
      ],
      [
        "with null paymentMethod",
        {
          customerId: validCustomerId,
          products: validProductList,
          orderDate: validOrderDate,
          totalNumberOfUnits: validTotalNumberOfUnits,
          totalCost: validTotalCost,
          shippingAddress: validShippingAddress,
          billingAddress: validBillingAddress,
          status: validStatus,
          shippingMethod: validShippingMethod,
          paymentMethod: null,
        },
      ],
    ];

    paymentMethodRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
