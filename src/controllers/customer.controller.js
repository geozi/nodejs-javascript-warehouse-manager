const Customer = require("../models/customer.model");
const {
  customerAdditionRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");

/**
 * Handles new customer addition.
 *
 * When the create method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of new customer addition requests. If the validation
 * passes successfully, it proceeds to the main logic of the method which
 * handles new customer addition.
 */
const create = [
  ...customerAdditionRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        city,
        streetAddress,
        zipCode,
        customerType,
        username,
      } = req.body;

      const newCustomer = new Customer({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        city: city,
        streetAddress: streetAddress,
        zipCode: zipCode,
        customerType: customerType,
        username: username,
      });

      await newCustomer.save();
      res.status(201).json({ message: responseMessages.CUSTOMER_ADDED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          msg: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = { create };
