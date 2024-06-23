const mongoose = require("mongoose");

const userAuthenticationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});

const UserAuthentications = mongoose.model(
  "user_authentication_schema",
  userAuthenticationSchema
);
module.exports = UserAuthentications;
