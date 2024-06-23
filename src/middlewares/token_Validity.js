module.exports = async (req, res, next) => {
  const secureToken = req.user.jwtToken;
  try {
      if (!secureToken) {
          return res.status(401).send("Unauthorized: Missing token"); // Token is missing
      }
      const user = await user_jwt_schema.findOne({ jwtToken: secureToken });
      if (user) {
          req.user = user; // Attach the user object to the request for later use
          console.log(req.user);
          next();
      } else {
          res.status(401).send("Unauthorized: Invalid token"); // Token does not match any user
      }
  } catch (error) {
      next(error); // Pass any errors to the error handling middleware
  }
    
    next();
  }




