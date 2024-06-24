const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.cookies.jwtToken;
  console.log("Token: " +token);


  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        res.status(401).send({ err: err });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(403).send({ msg: "You are not Authorized!" });
  }
};
