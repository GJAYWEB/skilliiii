require('dotenv').config();
const nodemailer = require("nodemailer");

exports.contact = (req, res, next) => {
  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Function to generate HTML sections
  function generateHTMLContent({ name, email, linkedIn, phoneNumber, comments }) {
    let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
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
            border: 1px solid #ccc;
            border-radius: 10px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ccc;
          }
          td strong {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <table>
    `;

    // Generate HTML sections sequentially
    function generateSection(label, value) {
      return value ? `<tr><td><strong>${label}:</strong></td><td>${value}</td></tr>` : '';
    }
    
    htmlContent += generateSection('Name', name);
    htmlContent += generateSection('Email', email);
    htmlContent += generateSection('LinkedIn', linkedIn);
    htmlContent += generateSection('Phone Number', phoneNumber);
    htmlContent += generateSection('Comments', comments);

    htmlContent += `
          </table>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  }

  const result = generateHTMLContent(req.body);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New Contact Form Submission",
    html: result,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error: Email could not be sent");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent successfully" });

    }
  });
};
