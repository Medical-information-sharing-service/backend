const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  doctorName: {
    type: String,
  },
  licenseNumber: {
    type: String,
    unique: true,
    required: true,
  },
  medicalInstitution: {
    type: String,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
