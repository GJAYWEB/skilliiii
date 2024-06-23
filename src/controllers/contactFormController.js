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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
            <h2 style="color: #333;">New Contact Form Submission from </h2> ${req.user.email}
            <table style="width: 100%; border-collapse: collapse;">
    `;

    // Generate HTML sections sequentially
    function generateSection(label, value) {
      return value ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ccc;"><strong>${label}:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ccc;">${value}</td></tr>` : '';
    }
    
    htmlContent += generateSection('Name', name);
    htmlContent += generateSection('Email', email);
    htmlContent += generateSection('LinkedIn', linkedIn);
    htmlContent += generateSection('Phone Number', phoneNumber);
    htmlContent += generateSection('Comments', comments);

    htmlContent += `
            </table>
        </div>
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
      res.status(200).send("Email sent successfully");
    }
  });
};
