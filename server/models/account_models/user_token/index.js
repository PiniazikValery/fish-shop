const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: String,
});

const UserToken = mongoose.model("UserToken", UserTokenSchema);
module.exports = UserToken;
