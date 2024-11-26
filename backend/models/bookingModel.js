const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  mentorId: { type: String, required: true },
  userEmail: { type: String, required: true },
  mentorEmail: { type: String, default: 'None' },
  bookingDate: { type: String, required: true },
  bookingSlot: { type: String, required: true },
  meetlink: { type: String, required: true } 
}, { timestamps: true });

const Bookingmodel = mongoose.model("booking", bookingSchema);

module.exports = { Bookingmodel };
