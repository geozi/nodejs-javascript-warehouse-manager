const Customer = require("../../src/models/customer.model");
const {
  updateCustomerInfo,
} = require("../../src/controllers/customer.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Customer info update integration tests", () => {
  let req, res, next;

  const validId = "67710722913928977aa04ea0";
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
    Customer.findByIdAndUpdate = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("updated (201)", () => {
    const updatedCustomerCases = [
      [
        "with valid id only",
        {
          id: validId,
        },
      ],
      [
        "with valid fields",
        {
          id: validId,
          firstName: validFirstName,
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

    updatedCustomerCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of updateCustomerInfo) {
          await middleware(req, res, next);
        }

        expect(Customer.findByIdAndUpdate.mock.calls).toHaveLength(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: responseMessages.CUSTOMER_UPDATED,
        });
      });
    });
  });

  describe("bad request (400)", () => {
    const idRequiredCases = [
      [
        "with undefined id",
        {
          id: undefined,
        },
      ],
      [
        "with null id",
        {
          id: null,
        },
      ],
    ];

    idRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of updateCustomerInfo) {
          await middleware(req, res, next);
        }

        expect(Customer.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.CUSTOMER_ID_REQUIRED },
            { message: validationErrorMessages.CUSTOMER_ID_INVALID },
            { message: validationErrorMessages.CUSTOMER_ID_LENGTH },
          ],
        });
      });
    });

    const idLengthCases = [
      [
        "with too short id",
        {
          id: "67710722913928977",
        },
      ],
      [
        "with too long id",
        {
          id: "67710722913928977aa04ea067710722913928977aa04ea0",
        },
      ],
    ];

    idLengthCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of updateCustomerInfo) {
          await middleware(req, res, next);
        }

        expect(Customer.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_ID_LENGTH }],
        });
      });
    });

    const idInvalidCases = [
      [
        "with id containing special symbols",
        {
          id: "67*db12ed*29a1*ed143e37e",
        },
      ],
      [
        "with id containing white spaces",
        {
          id: "6771 722 13928977aa04ea0",
        },
      ],
      [
        "with id containing capital letters",
        {
          id: "67710722913928977AA04ea0",
        },
      ],
    ];

    idInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of updateCustomerInfo) {
          await middleware(req, res, next);
        }

        expect(Customer.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.CUSTOMER_ID_INVALID }],
        });
      });
    });
  });
});
