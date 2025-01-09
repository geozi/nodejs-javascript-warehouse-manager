/**
 * Customer controller functions.
 * @module src/controllers/customer
 */

const Customer = require("../models/customer.model");
const {
  customerAdditionRules,
  customerUpdateRules,
  customerDeletionRules,
} = require("../middleware/expressValidationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");
const mongoose = require("mongoose");

/**
 * Middleware array that contains new customer addition logic.
 *
 * @memberof module:src/controllers/customer
 * @type {Array<Object>}
 * @property {ValidationChain[]} customerAdditionRules - Express validation rules for customer addition.
 * @property {Function} anonymousAsyncFunction - Handles new customer addition requests and responses.
 */
const createCustomer = [
  ...customerAdditionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
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
 * Middleware array that contains customer info update logic.
 *
 * @memberof module:src/controllers/customer
 * @type {Array<Object>}
 * @property {ValidationChain[]} customerUpdateRules - Express validation rules for customer info updates.
 * @property {Function} anonymousAsyncFunction - Handles customer info update requests and responses.
 */
const updateCustomerInfo = [
  ...customerUpdateRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
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

      const idAsObjectId = new mongoose.Types.ObjectId(id);

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
        idAsObjectId,
        customerToUpdate,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (updatedCustomer === null) {
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
 * Middleware array that contains customer deletion logic.
 *
 * @memberof module:src/controllers/customer
 * @type {Array<Object>}
 * @property {ValidationChain[]} customerDeletionRules - Express validation rules for customer deletion.
 * @property {Function} anonymousAsyncFunction - Handles customer deletion requests and responses.
 */
const deleteCustomer = [
  ...customerDeletionRules(),
  async (req, res) => {
    const expressErrors = validator.validationResult(req);
    if (!expressErrors.isEmpty()) {
      const errorMsg = expressErrors.array().map((err) => ({
        message: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id } = req.body;
      const idAsObjectId = new mongoose.Types.ObjectId(id);
      const deletedCustomer = await Customer.findByIdAndDelete(idAsObjectId);

      if (deletedCustomer === null) {
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
