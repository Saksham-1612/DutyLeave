const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  attendees: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      attended: { type: Boolean, default: false },
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
