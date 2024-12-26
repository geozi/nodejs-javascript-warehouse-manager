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

    const nameRequiredCases = [
      [
        "with undefined name",
        {
          name: undefined,
          price: validPrice,
          category: validCategory,
        },
      ],
      [
        "with null name",
        {
          name: null,
          price: validPrice,
          category: validCategory,
        },
      ],
    ];

    nameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newProduct = new Product(input);
        const err = newProduct.validateSync();

        expect(err.errors.name).toBeDefined();
        expect(err.errors.name.message).toBe(
          validationErrorMessages.PRODUCT_NAME_REQUIRED
        );
      });
    });

    const priceRequiredCases = [
      [
        "with undefined price",
        {
          name: validName,
          price: undefined,
          category: validCategory,
        },
      ],
      [
        "with null price",
        {
          name: validName,
          price: null,
          category: validCategory,
        },
      ],
    ];

    priceRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newProduct = new Product(input);
        const err = newProduct.validateSync();

        expect(err.errors.price).toBeDefined();
        expect(err.errors.price.message).toBe(
          validationErrorMessages.PRICE_REQUIRED
        );
      });
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

    const categoryRequiredCases = [
      [
        "with undefined category",
        {
          name: validName,
          price: validPrice,
          category: undefined,
        },
      ],
      [
        "with null  category",
        {
          name: validName,
          price: validPrice,
          category: null,
        },
      ],
    ];

    categoryRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newProduct = new Product(input);
        const err = newProduct.validateSync();

        expect(err.errors.category).toBeDefined();
        expect(err.errors.category.message).toBe(
          validationErrorMessages.CATEGORY_REQUIRED
        );
      });
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

    test("with 2 undefined fields", () => {
      const newProduct = new Product({
        name: undefined,
        price: undefined,
        category: validCategory,
      });

      const err = newProduct.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual(["name", "price"]);
      expect(err.errors.name.message).toBe(
        validationErrorMessages.PRODUCT_NAME_REQUIRED
      );
      expect(err.errors.price.message).toBe(
        validationErrorMessages.PRICE_REQUIRED
      );
    });

    test("with 2 null fields", () => {
      const newProduct = new Product({
        name: null,
        price: validPrice,
        category: null,
      });

      const err = newProduct.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "category",
        "name",
      ]);
      expect(err.errors.name.message).toBe(
        validationErrorMessages.PRODUCT_NAME_REQUIRED
      );
      expect(err.errors.category.message).toBe(
        validationErrorMessages.CATEGORY_REQUIRED
      );
    });

    test("with mix of undefined and null fields", () => {
      const newProduct = new Product({
        name: undefined,
        price: null,
        category: validCategory,
      });

      const err = newProduct.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual(["name", "price"]);
      expect(err.errors.name.message).toBe(
        validationErrorMessages.PRODUCT_NAME_REQUIRED
      );
      expect(err.errors.price.message).toBe(
        validationErrorMessages.PRICE_REQUIRED
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
