const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  patientId: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
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
  residentNumber: {
    type: String,
    unique: true,
    required: true,
  },
  doctorList: {
    // 담당 의사 리스트
    type: [String],
    required: true,
  },
  agreeList: {
    // 요청 리스트
    type: [String],
  },
});

module.exports = mongoose.model("Patient", patientSchema);
