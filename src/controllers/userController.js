require('dotenv').config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const user_authentication_schema = require("../models/User_Authentication _Schema");

const SECRET_KEY = process.env.JWT_SECRET;

const namespace = process.env.NAMESPACE;
const name = process.env.NAME;

exports.userName = (req, res, next) => {
  res.status(200).json(req.user);
};

exports.authentication = async (req, res, next) => {

  const { email, password } = req.body;

  const user = await user_authentication_schema.find({ email: email });
  
  if (user.length !== 0) {
    const _id = user[0]._id;
    if (user[0].password !== 0) {
      const passwordMatch = await bcrypt.compare(password, user[0].password);
      if (passwordMatch) {
        const jwtGenerator = jwt.sign(
          {
            id: _id,
            email: email,
            password: password,
          },
          SECRET_KEY,
          { expiresIn: "15m" } //Expires in 15 minutes
        );

        console.log(jwtGenerator);
        res.status(200).cookie('jwtToken', jwtGenerator, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          sameSite: 'None',
          expires: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }).json({
          success: true,
          message: 'User found',
          user: user,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "password does not match!",
        });
      }
    }
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};exports.signin = async (req, res, next) => {
  // Generate a secret key
  const secret = speakeasy.generateSecret({ length: 20 });

  // Generate a TOTP based on the secret key
  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });
  
  const { email, password } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${email}`,
    subject: "Email Verification Link",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #ffffff;
            border: 2px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .content {
            padding: 20px;
            border-top: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
            color: #000000;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: #0056b3;
          }
          .button:visited {
            color: #ffffff;
          }
          .otp {
            text-align: center;
            font-size: 36px;
            margin-top: 20px;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f5f5f5;
            border: 2px dashed #ccc;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Email Verification</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for signing up with us. Please use the following OTP to verify your email:</p>
            <div class="otp">${token}</div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best Regards,<br>Your Application Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = new user_authentication_schema({
    email: email,
    password: hashedPassword,
    token: token,
  });

  user_authentication_schema.find({ email: email }).then((user) => {
    if (user.length != 0) {
      res.status(200).json({
        success: true,
        message: "User with provided email id already exists. Try Login In!!",
      });
    } else {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error: Email could not be sent");
        } else {
          req.session.emailToken = token;
          req.session.userData = userData;
          console.log('Session data:', req.session); 
          // Explicitly save the session
          req.session.save((err) => {
            if (err) {
              console.error("Session save error:", err);
              return res.status(500).send("Error saving session");
            }

            console.log("Session after saving:", req.session);
            res.status(200).json({
              success: true,
              message: "Email has been sent for verification. Please check your inbox!!",
            });
          });
        }
      });
    }
  });
};
exports.emailVarifier = async (req, res, next) => {
  // Extract the token from the request body
  const { token } = req.body;
  console.log("Received token:", token);
  console.log("Session token:", req.session);

  // Check if the token is provided in the request
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  // Check if the session has the emailToken set
  if (!req.session.emailToken) {
    return res.status(400).json({
      success: false,
      message: "Session token is missing",
    });
  }

  // Verify the provided token against the session token
  if (req.session.emailToken !== token) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Retrieve user data from the session
  const userData = req.session.userData;
  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "User data is missing in session",
    });
  }

  try {
    // Create a new user document and save it to the database
    const user = new user_authentication_schema(userData);
    await user.save();

    // Clear the session token and user data after successfully saving the user
    req.session.emailToken = null;
    req.session.userData = null;

    // Destroy the session after successfully saving the user
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({
          success: false,
          message: "Error destroying session after saving user",
        });
      }

      res.status(200).json({
        success: true,
        message: "Email has been verified!",
        userData: user,
      });
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      success: false,
      message: "Error saving user data",
    });
  }
};


exports.logout = (req, res, next) => {
  // Clear the JWT token cookie
  res.clearCookie("jwtToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'None'
  });

  // Respond with a successful logout message
  res.status(200).json({
    success: true,
    message: "Logged out successfully!"
  });
};


exports.forgotPassword = (req, res, next) => {
  const email = req.body.email;

  user_authentication_schema.find({ email: email }).then(async (user) => {
    if (user.length > 0) {
      if (user[0].email == req.user.email) {
        const randomUUID = uuidv4({ namespace });
        const emailToken = uuidv4({ randomUUID, name });
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: `${email}`,
          subject: "Forgot password Link",
          html: `
            <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .container {
                  max-width: 600px;
                  margin: auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border: 2px solid #ccc;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .content {
                  padding: 20px;
                  border-top: 2px solid #ccc;
                  border-bottom: 2px solid #ccc;
                  color: #000000;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff !important;
                  text-decoration: none;
                  border-radius: 5px;
                  transition: background-color 0.3s;
                }
                .button:hover {
                  background-color: #0056b3;
                }
                .button:visited {
                  color: #ffffff;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Forgot Password ?</h2>
                </div>
                <div class="content">
                  <p>Please click the button below to change the password.</p>
                  <a href="http://localhost:3000/api/user/changePassword/${emailToken}" class="button">Change Passwod</a>
                </div>
              </div>
            </body>
            </html>
          `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(500).send("Error: Email could not be sent");
          } else {
            req.session.emailToken = emailToken;
            req.session.userData = user;
            res.status(200).json({
              success: true,
              message:
                "Email has been sent for verification. Please check your inbox!!",
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: "Not authorized activity!",
        });
      }
    } else {
      res.json({
        success: false,
        message: "User is not found! Please try to register first.",
      });
    }
  });
};

exports.resetPassGetToken = (req, res, next) => {
  const resetPasswordToken = req.params.token;

  console.log(req.session.emailToken);
  // if (resetPasswordToken === req.session.emailToken) {
  //   user_authentication_schema.find({email: res.session.userData[0].email}).then((user) => {
  //     if(user.length > 0){
  //       res.json({ success: true, message: user[0] });
  //     }
  //     else{
  //       res.json({ success: false, message: "Sorry! try again with the same browser!" });
  //     }
  //   })
  // } else {
  //   res.json({ success: false, message: "Token is not verified" });
  // }
};
