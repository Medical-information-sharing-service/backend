const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  patientId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  gender: {
    enum: ["male", "female"],
  },
  address: {
    type: String,
  },
  birth: {
    type: Date,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
