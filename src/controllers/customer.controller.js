const Customer = require("../models/customer.model");
const {
  customerAdditionRules,
  customerUpdateRules,
  customerDeletionRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");

/**
 * Handles new customer addition requests.
 *
 * When the createCustomer method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of new customer addition requests. If the validation
 * passes successfully, it proceeds to the main logic of the method which
 * handles new customer addition.
 */
const createCustomer = [
  ...customerAdditionRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        message: err.msg,
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
          message: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Handles customer information update requests.
 *
 * When the updateCustomerInfo method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of customer information update requests. If the
 * validation passes successfully, it proceeds to the main logic of the
 * method which handles customer information updates.
 */
const updateCustomerInfo = [
  ...customerUpdateRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const {
        id,
        firstName,
        lastName,
        phoneNumber,
        city,
        streetAddress,
        zipCode,
        customerType,
        username,
      } = req.body;

      const customerToUpdate = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        city: city,
        streetAddress: streetAddress,
        zipCode: zipCode,
        customerType: customerType,
        username: username,
      };

      const updatedCustomer = await Customer.findByIdAndUpdate(
        id,
        customerToUpdate,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (!updatedCustomer) {
        return res
          .status(404)
          .json({ message: responseMessages.CUSTOMER_NOT_FOUND });
      }

      return res
        .status(201)
        .json({ message: responseMessages.CUSTOMER_UPDATED });
    } catch (err) {
      if (err.name == "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Handles customer deletion.
 *
 * When the deleteCustomer method is called, it first
 * executes the ValidationChain path, running all middleware
 * functions responsible for the validation of customer
 * deletion requests. If the validation passes successfully, it
 * proceeds to the main logic of the method which handles
 * customer removals.
 */
const deleteCustomer = [
  ...customerDeletionRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id } = req.body;
      const deletedCustomer = await Customer.findByIdAndDelete(id);

      if (!deletedCustomer) {
        return res
          .status(404)
          .json({ message: responseMessages.CUSTOMER_NOT_FOUND });
      }

      return res.status(204).json({});
    } catch (err) {
      if (err.name == "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          message: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = { createCustomer, updateCustomerInfo, deleteCustomer };
