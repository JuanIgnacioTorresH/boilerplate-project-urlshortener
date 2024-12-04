const mongoose = require("mongoose");

const url = new mongoose.Schema(
    {
      original_url:{
        type: String
      },
      short_url: {
        type: Number
      }
    },
    { collection: "URLs" }
  )
module.exports = mongoose.model("urls", url);