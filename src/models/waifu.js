const mongoose = require("mongoose");

const waifuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    ownerID: {
      type: String,
      require: true,
    },
    messages: {
      type: Array,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("waifu", waifuSchema);
