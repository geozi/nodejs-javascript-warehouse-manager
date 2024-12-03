/**
 * The Customer model schema is an representation
 * of a warehouse customer.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  street: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
