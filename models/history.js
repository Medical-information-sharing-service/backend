const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const {
  Types: { ObjectId },
} = Schema;

const historySchema = new Schema({
  patientId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  licenseNumber: {
    type: ObjectId,
    required: true,
    ref: "Doctor",
  },
  diagnosisCode: {
    type: String,
  },
  prognosis: {
    // 진단 내용
    type: String,
  },
  diagnosisDate: {
    // 진단 일
    type: Date,
  },
  onsetDate: {
    // 발병일
    type: Date,
  },
  hospitalizationDate: {
    // 입원 일
    type: Date,
  },
});

module.exports = mongoose.model("History", historySchema);
