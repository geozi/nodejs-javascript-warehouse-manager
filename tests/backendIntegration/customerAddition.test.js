const Customer = require("../../src/models/customer.model");
const { createCustomer } = require("../../src/controllers/customer.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Customer addition integration tests", () => {
  let req, res, next;

  const input = {
    firstName: "Maria",
    lastName: "Bennet",
    phoneNumber: "620-763-3940",
    city: "Athens",
    streetAddress: "Acropolis 1",
    zipCode: "11742",
    customerType: "retail",
    username: "helloWorld",
  };

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
      let validInput = { ...input };
      req = { body: validInput };

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
      ["with undefined firstName", undefined],
      ["with null firstName", null],
    ];

    firstNameRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.firstName = invalidInput;

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
      ["with undefined lastName", undefined],
      ["with null lastName", null],
    ];

    lastNameRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.lastName = invalidInput;

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
      ["with undefined phoneNumber", undefined],
      ["with null phoneNumber", null],
    ];

    phoneNumberRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.phoneNumber = invalidInput;

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
      ["with undefined city", undefined],
      ["with null city", null],
    ];

    cityRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.city = invalidInput;

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
      ["with undefined streetAddress", undefined],
      ["with null streetAddress", null],
    ];

    streetAddressRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.streetAddress = invalidInput;

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
      ["with undefined zipCode", undefined],
      ["with null zipCode", null],
    ];

    zipCodeRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.zipCode = invalidInput;

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
      ["with undefined customerType", undefined],
      ["with null customerType", null],
    ];

    customerTypeRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.customerType = invalidInput;

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
      ["with undefined username", undefined],
      ["with null username", null],
    ];

    usernameRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.username = invalidInput;

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
