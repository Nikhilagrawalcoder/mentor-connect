const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["mentor", "mentee"], default: "mentee", required: true },
  location: { type: String, required: true },
  expertise: String,
  meetLink: String
  }
);


const Usermodel = mongoose.model('user', userSchema);

module.exports = {
  Usermodel
};
