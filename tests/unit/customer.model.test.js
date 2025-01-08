/**
 * Customer model unit tests.
 */

const Customer = require("../../src/models/customer.model");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Customer model unit tests", () => {
  describe("new customer test", () => {
    const validInput = {
      firstName: "Mark",
      lastName: "Bennet",
      phoneNumber: "845-038-9950",
      city: "Athens",
      streetAddress: "Acropolis 1",
      zipCode: "63038",
      customerType: "retail",
      username: "newUser",
    };

    beforeAll(() => {
      mockingoose(Customer);
    });

    afterAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newCustomer = new Customer(validInput);
      const err = newCustomer.validateSync();

      expect(err).toBeUndefined();
    });

    test("with too short firstName", () => {
      const newCustomer = new Customer(validInput);
      newCustomer.firstName = "L";
      const err = newCustomer.validateSync();

      expect(err.errors.firstName).toBeDefined();
      expect(err.errors.firstName.message).toBe(
        validationErrorMessages.FIRST_NAME_MIN_LENGTH
      );
    });

    test("with invalid firstName", () => {
      const newCustomer = new Customer(validInput);
      newCustomer.firstName = "L3roy";
      const err = newCustomer.validateSync();

      expect(err.errors.firstName).toBeDefined();
      expect(err.errors.firstName.message).toBe(
        validationErrorMessages.FIRST_NAME_INVALID
      );
    });

    test("with too short lastName", () => {
      const newCustomer = new Customer(validInput);
      newCustomer.lastName = "A";
      const err = newCustomer.validateSync();

      expect(err.errors.lastName).toBeDefined();
      expect(err.errors.lastName.message).toBe(
        validationErrorMessages.LAST_NAME_MIN_LENGTH
      );
    });

    test("with invalid lastName", () => {
      const newCustomer = new Customer(validInput);
      newCustomer.lastName = "B3nn3t";
      const err = newCustomer.validateSync();

      expect(err.errors.lastName).toBeDefined();
      expect(err.errors.lastName.message).toBe(
        validationErrorMessages.LAST_NAME_INVALID
      );
    });

    test("with too short phoneNumber", () => {
      const newCustomer = new Customer(validInput);
      newCustomer.phoneNumber = "1234";
      const err = newCustomer.validateSync();

      expect(err.errors.phoneNumber).toBeDefined();
      expect(err.errors.phoneNumber.message).toBe(
        validationErrorMessages.PHONE_NUMBER_MIN_LENGTH
      );
    });

    const phoneNumberInvalidCases = [
      ["with invalid phoneNumber -> letters", "a1234-5678"],
      ["with invalid phoneNumber -> special symbols", "1234*5678"],
      ["with invalid phoneNumber -> hyphen position", "1234-5678-"],
      ["with invalid phoneNumber -> letters + special symbols", "a12*4-5678"],
    ];

    phoneNumberInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, () => {
        const newCustomer = new Customer(validInput);
        newCustomer.phoneNumber = invalidInput;
        const err = newCustomer.validateSync();

        expect(err.errors.phoneNumber).toBeDefined();
        expect(err.errors.phoneNumber.message).toBe(
          validationErrorMessages.PHONE_NUMBER_INVALID
        );
      });
    });

    const cityInvalidCases = [
      ["with invalid city -> digits", "Ath3ns"],
      ["with invalid city -> special symbols", "@thens"],
      ["with invalid city -> digits + special symbols", "@th3ns"],
    ];

    cityInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, () => {
        const newCustomer = new Customer(validInput);
        newCustomer.city = invalidInput;
        const err = newCustomer.validateSync();

        expect(err.errors.city).toBeDefined();
        expect(err.errors.city.message).toBe(
          validationErrorMessages.CITY_INVALID
        );
      });
    });

    const zipCodeInvalidCases = [
      ["with invalid zipCode -> letters", "6453a"],
      ["with invalid zipCode -> special symbols", "123B5"],
      ["with invalid zipCode -> whitespace", "4556 6"],
      ["with invalid zipCode -> letters + special symbols", "64@31L"],
      ["with invalid zipCode -> length !== 5", "645378"],
    ];

    zipCodeInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, () => {
        const newCustomer = new Customer(validInput);
        newCustomer.zipCode = invalidInput;
        const err = newCustomer.validateSync();

        expect(err.errors.zipCode).toBeDefined();
        expect(err.errors.zipCode.message).toBe(
          validationErrorMessages.ZIP_CODE_INVALID
        );
      });
    });

    test("with invalid customerType", () => {
      const newCustomer = new Customer(validInput);
      newCustomer.customerType = "consumer";
      const err = newCustomer.validateSync();

      expect(err.errors.customerType).toBeDefined();
      expect(err.errors.customerType.message).toBe(
        validationErrorMessages.CUSTOMER_TYPE_INVALID
      );
    });

    test("with mix of undefined and invalid fields", () => {
      const newCustomer = new Customer(validInput);
      newCustomer.lastName = "B3nnet";
      newCustomer.city = undefined;
      newCustomer.zipCode = "123456";
      newCustomer.username = undefined;
      const err = newCustomer.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(4);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "city",
        "lastName",
        "username",
        "zipCode",
      ]);
      expect(err.errors.lastName.message).toBe(
        validationErrorMessages.LAST_NAME_INVALID
      );
      expect(err.errors.city.message).toBe(
        validationErrorMessages.CITY_REQUIRED
      );
      expect(err.errors.zipCode.message).toBe(
        validationErrorMessages.ZIP_CODE_INVALID
      );
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_REQUIRED
      );
    });
  });
});
