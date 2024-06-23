<<<<<<< HEAD
app.post('/contact', (req, res) => {
    const { email, name, phoneNumber, comments } = req.body;

    // Send email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gajjar.jay2546@gmail.com',
            pass: 'gqis enkd xtti parl'
        }
    });

    const mailOptions = {
        from: 'savanparvadiya338@gmail.com',
        to: 'gajjar.jay2546@gmail.com', // This can also be fetched from the database
        subject: 'New Contact Form Submission',
        text: `
            Name: ${name}
            Email: ${email}
            Phone Number: ${phoneNumber}
            Comments: ${comments}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error: Email could not be sent');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});
=======
# skilliiii
Resume Web App
>>>>>>> c86f61b7bfe0f600073b754b3c91899d8b03231a
