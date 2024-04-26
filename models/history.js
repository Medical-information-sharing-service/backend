const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const {
  Types: { ObjectId },
} = Schema;

const historySchema = new Schema({
  patientId: {
    type: String,
    required: true,
    ref: "Patient",
  },
  licenseNumber: {
    type: String,
    required: true,
    ref: "Doctor",
  },
  diagnosisCode: {
    type: String,
  },
  prognosis: {
    type: String,
  },
  diagnosisDate: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
  },
});

module.exports = mongoose.model("History", historySchema);
