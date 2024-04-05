const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  licensePlate: {
    type: String,
    required: true
  },
  make: {
    type: String,
    required: true
  },
  VIN: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  milesDriven: {
    type: Number,
    required: true
  }
});

const vehicleModel = mongoose.model('Vehicle', vehicleSchema);
module.exports = vehicleModel;
