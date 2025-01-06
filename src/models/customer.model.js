/**
 * Customer schema.
 * @module src/models/customer
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const {
  NAME_REGEX,
  CITY_REGEX,
  ZIP_CODE_REGEX,
  PHONE_REGEX,
} = require("../resources/validationRegExp");

/**
 * Customer schema for persistence in MongoDB.
 *
 * @memberof module:src/models/customer
 * @type {mongoose.Schema<Customer>}
 * @typedef {Object} Customer
 * @property {String} firstName - The first name of the customer.
 * @property {String} lastName - The last name of the customer.
 * @property {String} phoneNumber - The phone number of the customer.
 * @property {String} city - The city where the customer lives.
 * @property {String} streetAddress - The street address where the customer resides.
 * @property {String} zipCode - The zip code of the customer's residential area
 * @property {String} customerType - The categorization of the customer (wholesale / retail)
 * @property {String} username - The username of the customer
 */
const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, validationErrorMessages.FIRST_NAME_REQUIRED],
      minLength: [2, validationErrorMessages.FIRST_NAME_MIN_LENGTH],
      match: [NAME_REGEX, validationErrorMessages.FIRST_NAME_INVALID],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, validationErrorMessages.LAST_NAME_REQUIRED],
      minLength: [2, validationErrorMessages.LAST_NAME_MIN_LENGTH],
      match: [NAME_REGEX, validationErrorMessages.LAST_NAME_INVALID],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, validationErrorMessages.PHONE_NUMBER_REQUIRED],
      validate: {
        validator: function (value) {
          const minLength = 7;
          if (value.length < minLength) {
            return false;
          }
          return PHONE_REGEX.test(value);
        },
        message: function (props) {
          if (props.value.length < 7) {
            return validationErrorMessages.PHONE_NUMBER_MIN_LENGTH;
          }
          return validationErrorMessages.PHONE_NUMBER_INVALID;
        },
      },
      trim: true,
    },
    city: {
      type: String,
      required: [true, validationErrorMessages.CITY_REQUIRED],
      match: [CITY_REGEX, validationErrorMessages.CITY_INVALID],
      trim: true,
    },
    streetAddress: {
      type: String,
      required: [true, validationErrorMessages.STREET_ADDRESS_REQUIRED],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, validationErrorMessages.ZIP_CODE_REQUIRED],
      match: [ZIP_CODE_REGEX, validationErrorMessages.ZIP_CODE_INVALID],
      trim: true,
    },
    customerType: {
      type: String,
      required: [true, validationErrorMessages.CUSTOMER_TYPE_REQUIRED],
      enum: {
        values: ["wholesale", "retail"],
        message: validationErrorMessages.CUSTOMER_TYPE_INVALID,
      },
    },
    username: {
      type: String,
      unique: [true, validationErrorMessages.USERNAME_UNIQUE],
      required: [true, validationErrorMessages.USERNAME_REQUIRED],
      trim: true,
    },
  },
  {
    collection: "customers",
    timestamps: true,
  }
);

customerSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Customer", customerSchema);
