/**
 * Customer model unit tests.
 */

const Customer = require("../../src/models/customer.model");
const mockingoose = require("mockingoose");

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
  });
});
