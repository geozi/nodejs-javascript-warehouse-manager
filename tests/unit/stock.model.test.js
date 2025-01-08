/**
 * Stock model unit tests.
 */

const Stock = require("../../src/models/stock.model");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Stock model unit tests", () => {
  describe("new stock model test", () => {
    const validInput = {
      productId: new mongoose.Types.ObjectId("676d994aafb0aa25e4338495"),
      numberOfUnits: 10,
    };

    beforeAll(() => {
      mockingoose(Stock);
    });

    afterAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newStock = new Stock(validInput);
      const err = newStock.validateSync();
      expect(err).toBeUndefined();
    });

    test("with negative numberOfUnits", () => {
      const newStock = new Stock(validInput);
      newStock.numberOfUnits = -1;
      const err = newStock.validateSync();

      expect(err.errors.numberOfUnits).toBeDefined();
      expect(err.errors.numberOfUnits.message).toBe(
        validationErrorMessages.UNIT_NUMBER_NEGATIVE
      );
    });
  });
});
