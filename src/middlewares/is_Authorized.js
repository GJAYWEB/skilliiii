const jwt = require("jsonwebtoken");
const SECRET_KEY = "MySecretKey";

module.exports = (req, res, next) => {
  const token = req.cookies.jwtToken;
  console.log(token);

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
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
