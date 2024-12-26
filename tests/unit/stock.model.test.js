/**
 * Stock model unit tests.
 */

const Stock = require("../../src/models/stock.model");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Stock model unit tests", () => {
  describe("new stock model test", () => {
    const validProductId = new mongoose.Types.ObjectId(
      "676d994aafb0aa25e4338495"
    );
    const validNumberOfUnits = 10;

    beforeAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newStock = new Stock({
        productId: validProductId,
        numberOfUnits: validNumberOfUnits,
      });

      const err = newStock.validateSync();
      expect(err).toBeUndefined();
    });

    const productIdRequiredCases = [
      [
        "with undefined productId",
        {
          productId: undefined,
          numberOfUnits: validNumberOfUnits,
        },
      ],
      [
        "with null productId",
        {
          productId: null,
          numberOfUnits: validNumberOfUnits,
        },
      ],
    ];

    productIdRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newStock = new Stock(input);
        const err = newStock.validateSync();

        expect(err.errors.productId).toBeDefined();
        expect(err.errors.productId.message).toBe(
          validationErrorMessages.PRODUCT_ID_REQUIRED
        );
      });
    });

    const unitNumberRequiredCases = [
      [
        "with undefined numberOfUnits",
        {
          productId: validProductId,
          numberOfUnits: undefined,
        },
      ],
      [
        "with null numbersOfUnits",
        {
          productId: validProductId,
          numberOfUnits: null,
        },
      ],
    ];

    unitNumberRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newStock = new Stock(input);
        const err = newStock.validateSync();

        expect(err.errors.numberOfUnits).toBeDefined();
        expect(err.errors.numberOfUnits.message).toBe(
          validationErrorMessages.UNIT_NUMBER_REQUIRED
        );
      });
    });
  });
});
