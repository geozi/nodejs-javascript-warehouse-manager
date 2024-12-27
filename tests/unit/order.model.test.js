/**
 * Order model units tests.
 */

const Order = require("../../src/models/order.model");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Order model unit tests", () => {
  describe("new order test", () => {
    beforeAll(() => {
      mockingoose.resetAll();
    });

    const validCustomerId = new mongoose.Types.ObjectId(
      "676ebb16ef1902e59f440af8"
    );
    const validProductList = [
      new mongoose.Types.ObjectId("676ebc4f4c7fe8bc98eb8142"),
      new mongoose.Types.ObjectId("676ebc5d4b3523f3fa29559f"),
      new mongoose.Types.ObjectId("676ebc6946f5a33e21734847"),
    ];
    const validOrderDate = new Date();
    const validTotalNumberOfUnits = 2;
    const validTotalCost = 95;
    const validShippingAddress = "Akropolis 1, Athens";
    const validBillingAddress = "Akropolis 1, Athens";
    const validStatus = "Pending";
    const validShippingMethod = "Standard";
    const validPaymentMethod = "Credit/Debit card";

    test("with valid fields", () => {
      const newOrder = new Order({
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
      });

      const err = newOrder.validateSync();
      expect(err).toBeUndefined();
    });

    const customerIdRequiredCases = [
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

    customerIdRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.customerId).toBeDefined();
        expect(err.errors.customerId.message).toBe(
          validationErrorMessages.CUSTOMER_ID_REQUIRED
        );
      });
    });

    const productsRequiredCases = [
      [
        "with undefined product list",
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
        "with null product list",
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
      [
        "with zero length product list",
        {
          customerId: validCustomerId,
          products: [],
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.products).toBeDefined();
        expect(err.errors.products.message).toBe(
          validationErrorMessages.PRODUCT_ITEMS_REQUIRED
        );
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.orderDate).toBeDefined();
        expect(err.errors.orderDate.message).toBe(
          validationErrorMessages.ORDER_DATE_REQUIRED
        );
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.totalNumberOfUnits).toBeDefined();
        expect(err.errors.totalNumberOfUnits.message).toBe(
          validationErrorMessages.TOTAL_UNIT_NUMBER_REQUIRED
        );
      });
    });

    test("with totalNumberOfUnits = 0", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: 0,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(err.errors.totalNumberOfUnits).toBeDefined();
      expect(err.errors.totalNumberOfUnits.message).toBe(
        validationErrorMessages.TOTAL_UNIT_NUMBER_ABOVE_ZERO
      );
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.totalCost).toBeDefined();
        expect(err.errors.totalCost.message).toBe(
          validationErrorMessages.TOTAL_COST_REQUIRED
        );
      });
    });

    test("with totalCost = 0", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: 0,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });

      const err = newOrder.validateSync();

      expect(err.errors.totalCost).toBeDefined();
      expect(err.errors.totalCost.message).toBe(
        validationErrorMessages.TOTAL_COST_ABOVE_ZERO
      );
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.shippingAddress).toBeDefined();
        expect(err.errors.shippingAddress.message).toBe(
          validationErrorMessages.SHIPPING_ADDRESS_REQUIRED
        );
      });
    });

    const billingAddressRequiredCases = [
      [
        "with undefined billing address",
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
        "with null billing address",
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.billingAddress).toBeDefined();
        expect(err.errors.billingAddress.message).toBe(
          validationErrorMessages.BILLING_ADDRESS_REQUIRED
        );
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.status).toBeDefined();
        expect(err.errors.status.message).toBe(
          validationErrorMessages.STATUS_REQUIRED
        );
      });
    });

    test("with invalid status", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: "Ready",
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(err.errors.status).toBeDefined();
      expect(err.errors.status.message).toBe(
        validationErrorMessages.STATUS_INVALID
      );
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.shippingMethod).toBeDefined();
        expect(err.errors.shippingMethod.message).toBe(
          validationErrorMessages.SHIPPING_METHOD_REQUIRED
        );
      });
    });

    test("with invalid shippingMethod", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: "Fast",
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(err.errors.shippingMethod).toBeDefined();
      expect(err.errors.shippingMethod.message).toBe(
        validationErrorMessages.SHIPPING_METHOD_INVALID
      );
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
      test(testName, () => {
        const newOrder = new Order(input);
        const err = newOrder.validateSync();

        expect(err.errors.paymentMethod).toBeDefined();
        expect(err.errors.paymentMethod.message).toBe(
          validationErrorMessages.PAYMENT_METHOD_REQUIRED
        );
      });
    });

    test("with invalid paymentMethod", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: "Coins",
      });
      const err = newOrder.validateSync();

      expect(err.errors.paymentMethod).toBeDefined();
      expect(err.errors.paymentMethod.message).toBe(
        validationErrorMessages.PAYMENT_METHOD_INVALID
      );
    });

    test("with 3 undefined fields", () => {
      const newOrder = new Order({
        customerId: undefined,
        products: validProductList,
        orderDate: undefined,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: undefined,
      });
      const err = newOrder.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(3);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "customerId",
        "orderDate",
        "paymentMethod",
      ]);
      expect(err.errors.customerId.message).toBe(
        validationErrorMessages.CUSTOMER_ID_REQUIRED
      );
      expect(err.errors.orderDate.message).toBe(
        validationErrorMessages.ORDER_DATE_REQUIRED
      );
      expect(err.errors.paymentMethod.message).toBe(
        validationErrorMessages.PAYMENT_METHOD_REQUIRED
      );
    });

    test("with 2 null fields", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: null,
        orderDate: validOrderDate,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: validTotalCost,
        shippingAddress: null,
        billingAddress: validBillingAddress,
        status: validStatus,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "products",
        "shippingAddress",
      ]);
      expect(err.errors.products.message).toBe(
        validationErrorMessages.PRODUCT_ITEMS_REQUIRED
      );
      expect(err.errors.shippingAddress.message).toBe(
        validationErrorMessages.SHIPPING_ADDRESS_REQUIRED
      );
    });

    test("with mix of null and undefined fields", () => {
      const newOrder = new Order({
        customerId: validCustomerId,
        products: validProductList,
        orderDate: undefined,
        totalNumberOfUnits: validTotalNumberOfUnits,
        totalCost: null,
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
        status: null,
        shippingMethod: validShippingMethod,
        paymentMethod: validPaymentMethod,
      });
      const err = newOrder.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(3);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "orderDate",
        "status",
        "totalCost",
      ]);
      expect(err.errors.orderDate.message).toBe(
        validationErrorMessages.ORDER_DATE_REQUIRED
      );
      expect(err.errors.status.message).toBe(
        validationErrorMessages.STATUS_REQUIRED
      );
      expect(err.errors.totalCost.message).toBe(
        validationErrorMessages.TOTAL_COST_REQUIRED
      );
    });
  });
});
