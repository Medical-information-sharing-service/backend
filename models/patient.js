const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  patientId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model("Patient", patientSchema);
