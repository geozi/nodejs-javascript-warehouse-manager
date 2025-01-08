/**
 * Product model unit tests.
 */

const Product = require("../../src/models/product.model");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Product model unit tests", () => {
  describe("new product test", () => {
    const validInput = {
      name: "Computer Widget",
      price: "96",
      category: "Electronics",
    };

    beforeAll(() => {
      mockingoose(Product);
    });

    afterAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newProduct = new Product(validInput);

      const err = newProduct.validateSync();
      expect(err).toBeUndefined();
    });

    test("with negative price", () => {
      const newProduct = new Product(validInput);
      newProduct.price = -2.3;
      const err = newProduct.validateSync();

      expect(err.errors.price).toBeDefined();
      expect(err.errors.price.message).toBe(
        validationErrorMessages.PRICE_NEGATIVE
      );
    });

    test("with invalid category", () => {
      const newProduct = new Product(validInput);
      newProduct.category = "Games";
      const err = newProduct.validateSync();

      expect(err.errors.category).toBeDefined();
      expect(err.errors.category.message).toBe(
        validationErrorMessages.CATEGORY_INVALID
      );
    });

    test("with mix of undefined and invalid fields", () => {
      const newProduct = new Product(validInput);
      newProduct.price = undefined;
      newProduct.category = "Games";
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
