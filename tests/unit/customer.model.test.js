/**
 * Customer model unit tests.
 */

const Customer = require("../../src/models/customer.model");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Customer model unit tests", () => {
  describe("new customer test", () => {
    const validFirstName = "Mark";
    const validLastName = "Bennet";
    const validPhoneNumber = "845-038-9950";
    const validCity = "Athens";
    const validStreetAddress = "Akropolis 1";
    const validZipCode = "63038";
    const validCustomerType = "retail";
    const validUsername = "newUser";

    beforeAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newCustomer = new Customer({
        firstName: validFirstName,
        lastName: validLastName,
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: validCustomerType,
        username: validUsername,
      });

      const err = newCustomer.validateSync();
      expect(err).toBeUndefined();
    });

    const firstNameRequiredCases = [
      [
        "with undefined firstName",
        {
          firstName: undefined,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with null firstName",
        {
          firstName: null,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    firstNameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);
        const err = newCustomer.validateSync();

        expect(err.errors.firstName).toBeDefined();
        expect(err.errors.firstName.message).toBe(
          validationErrorMessages.FIRST_NAME_REQUIRED
        );
      });
    });

    test("with too short firstName", () => {
      const newCustomer = new Customer({
        firstName: "L",
        lastName: validLastName,
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: validCustomerType,
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(err.errors.firstName).toBeDefined();
      expect(err.errors.firstName.message).toBe(
        validationErrorMessages.FIRST_NAME_MIN_LENGTH
      );
    });

    test("with invalid firstName", () => {
      const newCustomer = new Customer({
        firstName: "L3roy",
        lastName: validLastName,
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: validCustomerType,
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(err.errors.firstName).toBeDefined();
      expect(err.errors.firstName.message).toBe(
        validationErrorMessages.FIRST_NAME_INVALID
      );
    });

    const lastNameRequiredCases = [
      [
        "with undefined lastName",
        {
          firstName: validFirstName,
          lastName: undefined,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with null lastName",
        {
          firstName: validFirstName,
          lastName: null,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    lastNameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.lastName).toBeDefined();
        expect(err.errors.lastName.message).toBe(
          validationErrorMessages.LAST_NAME_REQUIRED
        );
      });
    });

    test("with too short lastName", () => {
      const newCustomer = new Customer({
        firstName: validFirstName,
        lastName: "A",
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: validCustomerType,
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(err.errors.lastName).toBeDefined();
      expect(err.errors.lastName.message).toBe(
        validationErrorMessages.LAST_NAME_MIN_LENGTH
      );
    });

    test("with invalid lastName", () => {
      const newCustomer = new Customer({
        firstName: validFirstName,
        lastName: "B3nn3t",
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: validCustomerType,
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(err.errors.lastName).toBeDefined();
      expect(err.errors.lastName.message).toBe(
        validationErrorMessages.LAST_NAME_INVALID
      );
    });

    const phoneNumberRequiredCases = [
      [
        "with undefined phoneNumber",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: undefined,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with null phoneNumber",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: null,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    phoneNumberRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.phoneNumber).toBeDefined();
        expect(err.errors.phoneNumber.message).toBe(
          validationErrorMessages.PHONE_NUMBER_REQUIRED
        );
      });
    });

    test("with too short phoneNumber", () => {
      const newCustomer = new Customer({
        firstName: validFirstName,
        lastName: validLastName,
        phoneNumber: "1234",
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: validCustomerType,
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(err.errors.phoneNumber).toBeDefined();
      expect(err.errors.phoneNumber.message).toBe(
        validationErrorMessages.PHONE_NUMBER_MIN_LENGTH
      );
    });

    const phoneNumberInvalidCases = [
      [
        "with invalid phoneNumber -> letters",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: "a1234-5678",
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid phoneNumber -> special symbols",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: "1234*5678",
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid phoneNumber -> hyphen position",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: "1234-5678-",
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid phoneNumber -> letters + special symbols",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: "a12*4-5678",
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    phoneNumberInvalidCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.phoneNumber).toBeDefined();
        expect(err.errors.phoneNumber.message).toBe(
          validationErrorMessages.PHONE_NUMBER_INVALID
        );
      });
    });

    const cityRequiredCases = [
      [
        "with undefined city",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: undefined,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with null city",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: null,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    cityRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.city).toBeDefined();
        expect(err.errors.city.message).toBe(
          validationErrorMessages.CITY_REQUIRED
        );
      });
    });

    const cityInvalidCases = [
      [
        "with invalid city -> digits",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: "Ath3ns",
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid city -> special symbols",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: "@thens",
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid city -> digits + special symbols",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: "@th3ns",
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    cityInvalidCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.city).toBeDefined();
        expect(err.errors.city.message).toBe(
          validationErrorMessages.CITY_INVALID
        );
      });
    });

    const streetAddressRequiredCases = [
      [
        "with undefined streetAddress",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: undefined,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with null streetAddress",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: null,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    streetAddressRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.streetAddress).toBeDefined();
        expect(err.errors.streetAddress.message).toBe(
          validationErrorMessages.STREET_ADDRESS_REQUIRED
        );
      });
    });

    const zipCodeRequiredCases = [
      [
        "with undefined zipCode",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: undefined,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with null zipCode",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: null,
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    zipCodeRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.zipCode).toBeDefined();
        expect(err.errors.zipCode.message).toBe(
          validationErrorMessages.ZIP_CODE_REQUIRED
        );
      });
    });

    const zipCodeInvalidCases = [
      [
        "with invalid zipCode -> letters",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: "6453a",
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid zipCode -> special symbols",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: "123B5",
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid zipCode -> whitespace",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: "4556 6",
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid zipCode -> letters + special symbols",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: "64@31L",
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
      [
        "with invalid zipCode -> length !== 5",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: "645378",
          customerType: validCustomerType,
          username: validUsername,
        },
      ],
    ];

    zipCodeInvalidCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.zipCode).toBeDefined();
        expect(err.errors.zipCode.message).toBe(
          validationErrorMessages.ZIP_CODE_INVALID
        );
      });
    });

    const customerTypeRequiredCases = [
      [
        "with undefined customerType",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: undefined,
          username: validUsername,
        },
      ],
      [
        "with null customerType",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: null,
          username: validUsername,
        },
      ],
    ];

    customerTypeRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.customerType).toBeDefined();
        expect(err.errors.customerType.message).toBe(
          validationErrorMessages.CUSTOMER_TYPE_REQUIRED
        );
      });
    });

    test("with invalid customerType", () => {
      const newCustomer = new Customer({
        firstName: validFirstName,
        lastName: validLastName,
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: "consumer",
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(err.errors.customerType).toBeDefined();
      expect(err.errors.customerType.message).toBe(
        validationErrorMessages.CUSTOMER_TYPE_INVALID
      );
    });

    const usernameRequiredCases = [
      [
        "with undefined username",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: undefined,
        },
      ],
      [
        "with null username",
        {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: null,
        },
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newCustomer = new Customer(input);

        const err = newCustomer.validateSync();

        expect(err.errors.username).toBeDefined();
        expect(err.errors.username.message).toBe(
          validationErrorMessages.USERNAME_REQUIRED
        );
      });
    });

    test("with 2 undefined fields", () => {
      const newCustomer = new Customer({
        firstName: undefined,
        lastName: validLastName,
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: validStreetAddress,
        zipCode: validZipCode,
        customerType: undefined,
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "customerType",
        "firstName",
      ]);
      expect(err.errors.firstName.message).toBe(
        validationErrorMessages.FIRST_NAME_REQUIRED
      );
      expect(err.errors.customerType.message).toBe(
        validationErrorMessages.CUSTOMER_TYPE_REQUIRED
      );
    });

    test("with 3 null fields", () => {
      const newCustomer = new Customer({
        firstName: validFirstName,
        lastName: null,
        phoneNumber: validPhoneNumber,
        city: null,
        streetAddress: null,
        zipCode: validZipCode,
        customerType: validCustomerType,
        username: validUsername,
      });

      const err = newCustomer.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(3);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "city",
        "lastName",
        "streetAddress",
      ]);
      expect(err.errors.lastName.message).toBe(
        validationErrorMessages.LAST_NAME_REQUIRED
      );
      expect(err.errors.city.message).toBe(
        validationErrorMessages.CITY_REQUIRED
      );
      expect(err.errors.streetAddress.message).toBe(
        validationErrorMessages.STREET_ADDRESS_REQUIRED
      );
    });

    test("with mix of null and undefined fields", () => {
      const newCustomer = new Customer({
        firstName: undefined,
        lastName: null,
        phoneNumber: validPhoneNumber,
        city: validCity,
        streetAddress: null,
        zipCode: undefined,
        customerType: validCustomerType,
        username: undefined,
      });

      const err = newCustomer.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(5);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "firstName",
        "lastName",
        "streetAddress",
        "username",
        "zipCode",
      ]);
      expect(err.errors.firstName.message).toBe(
        validationErrorMessages.FIRST_NAME_REQUIRED
      );
      expect(err.errors.lastName.message).toBe(
        validationErrorMessages.LAST_NAME_REQUIRED
      );
      expect(err.errors.streetAddress.message).toBe(
        validationErrorMessages.STREET_ADDRESS_REQUIRED
      );
      expect(err.errors.zipCode.message).toBe(
        validationErrorMessages.ZIP_CODE_REQUIRED
      );
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_REQUIRED
      );
    });

    test("with mix of undefined and invalid fields", () => {
      const newCustomer = new Customer({
        firstName: validFirstName,
        lastName: "B3nnet",
        phoneNumber: validPhoneNumber,
        city: undefined,
        streetAddress: validStreetAddress,
        zipCode: "123456",
        customerType: validCustomerType,
        username: undefined,
      });

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
