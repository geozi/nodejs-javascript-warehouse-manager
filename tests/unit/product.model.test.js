/**
 * Product model unit tests.
 */

const Product = require("../../src/models/product.model");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Product model unit tests", () => {
  describe("new product test", () => {
    const validName = "Computer Widget";
    const validPrice = "96";
    const validCategory = "Electronics";

    beforeAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newProduct = new Product({
        name: validName,
        price: validPrice,
        category: validCategory,
      });

      const err = newProduct.validateSync();
      expect(err).toBeUndefined();
    });

    test("with negative price", () => {
      const newProduct = new Product({
        name: validName,
        price: -2.3,
        category: validCategory,
      });
      const err = newProduct.validateSync();

      expect(err.errors.price).toBeDefined();
      expect(err.errors.price.message).toBe(
        validationErrorMessages.PRICE_NEGATIVE
      );
    });

    test("with invalid category", () => {
      const newProduct = new Product({
        name: validName,
        price: validPrice,
        category: "Games",
      });

      const err = newProduct.validateSync();

      expect(err.errors.category).toBeDefined();
      expect(err.errors.category.message).toBe(
        validationErrorMessages.CATEGORY_INVALID
      );
    });

    test("with mix of undefined and invalid fields", () => {
      const newProduct = new Product({
        name: validName,
        price: undefined,
        category: "Games",
      });

      const err = newProduct.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "category",
        "price",
      ]);
      expect(err.errors.price.message).toBe(
        validationErrorMessages.PRICE_REQUIRED
      );
      expect(err.errors.category.message).toBe(
        validationErrorMessages.CATEGORY_INVALID
      );
    });
  });
});
