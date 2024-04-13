const mongoose = require("mongoose");

const messageStateSchema = new mongoose.Schema(
  {
    isReplied: {
      type: Boolean,
      require: true,
    },
    ownerID: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messageState", messageStateSchema);
