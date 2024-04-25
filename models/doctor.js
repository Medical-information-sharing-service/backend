const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  doctorName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    unique: true,
    required: true,
  },
  medicalInstitution: {
    type: String,
  },
  diagnosisCode: {
    type: String,
  },
  patientList: {
    type: [String],
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
