const Customer = require("../../src/models/customer.model");
const { createCustomer } = require("../../src/controllers/customer.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Customer addition integration tests", () => {
  let req, res, next;

  const validFirstName = "Maria";
  const validLastName = "Bennet";
  const validPhoneNumber = "620-763-3940";
  const validCity = "Athens";
  const validStreetAddress = "Acropolis 1";
  const validZipCode = "11742";
  const validCustomerType = "retail";
  const validUsername = "helloWorld";

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Customer.prototype.save = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("created (201)", () => {
    test("with valid fields", async () => {
      req = {
        body: {
          firstName: validFirstName,
          lastName: validLastName,
          phoneNumber: validPhoneNumber,
          city: validCity,
          streetAddress: validStreetAddress,
          zipCode: validZipCode,
          customerType: validCustomerType,
          username: validUsername,
        },
      };

      for (let middleware of createCustomer) {
        await middleware(req, res, next);
      }

      expect(Customer.prototype.save.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.CUSTOMER_ADDED,
      });
    });
  });

  describe("bad request (400)", () => {
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.FIRST_NAME_REQUIRED }],
        });
      });
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.LAST_NAME_REQUIRED }],
        });
      });
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.PHONE_NUMBER_REQUIRED }],
        });
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CITY_REQUIRED }],
        });
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.STREET_ADDRESS_REQUIRED },
          ],
        });
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.ZIP_CODE_REQUIRED }],
        });
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_TYPE_REQUIRED }],
        });
      });
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
      test(testName, async () => {
        req = { body: input };

        for (let middleware of createCustomer) {
          await middleware(req, res, next);
        }

        expect(Customer.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.USERNAME_REQUIRED }],
        });
      });
    });
  });
});
