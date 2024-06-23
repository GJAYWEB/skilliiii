const mongoose = require("mongoose");

const userJwtSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jwtToken: { type: String, required: true },
});

const UserJwt = mongoose.model(
  "user_jwt_schema",
  userJwtSchema
);
module.exports = UserJwt;
