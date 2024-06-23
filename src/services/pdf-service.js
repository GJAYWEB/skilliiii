const PDFDocument = require('pdfkit');
const resumeSchema = require('../models/Resume_Schema');

module.exports = function buildPdf(req, dataCallback, endCallback) {
    const doc = new PDFDocument({ margin: 50 });

    // Capture PDF data in chunks and send them to the client
    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    // Define colors and styles
    const primaryColor = '#000000'; // Black color for font
    const headerFontSize = 24; // Increased font size for the full name
    const subheaderFontSize = 18;
    const textFontSize = 12; // Decreased font size for descriptions
    const fontFamily = 'Helvetica'; // Professional font style

    // Function to draw a horizontal line
    function drawLine(y) {
        doc.strokeColor(primaryColor)
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }

    // Add content to the PDF document
    resumeSchema.find({ userId: req.user.id }).then(user => {
        if (user && user.length > 0) {
            const userData = user[0];
            const personalInfo = userData.personalInformation;

            // Full Name Title
            doc.fillColor(primaryColor)
                .fontSize(headerFontSize)
                .font('Helvetica-Bold') // Bold font for the full name
                .text(`${personalInfo.firstName} ${personalInfo.lastName}`)
                .moveDown(0.5);

            // Personal Details Section
            doc.fillColor(primaryColor)
                .fontSize(subheaderFontSize)
                .font(fontFamily)
                .fontSize(textFontSize)
                .text(`Email: ${personalInfo.email}`)
                .text(`Phone: ${personalInfo.phone}`)
                .text(`Address: ${personalInfo.address}`)
                .text(`Date of Birth: ${new Date(personalInfo.dateOfBirth).toDateString()}`)
                .text(`Nationality: ${personalInfo.nationality}`)
                .text(`Languages: ${personalInfo.languages.join(', ')}`)
                .moveDown();

            drawLine(doc.y);

            // Skills Section
            doc.moveDown()
                .fillColor(primaryColor)
                .fontSize(subheaderFontSize)
                .font(fontFamily)
                .text('Skills');

            doc.fontSize(textFontSize)
                .text(userData.skills.join(', '))
                .moveDown();

            drawLine(doc.y);

            // Education Section
            doc.moveDown()
                .fillColor(primaryColor)
                .fontSize(subheaderFontSize)
                .font(fontFamily)
                .text('Education');

            doc.fontSize(textFontSize);
            userData.education.forEach(edu => {
                doc.text(`${edu.degree} in ${edu.fieldOfStudy}`)
                    .text(`${edu.institution} - ${edu.startDate} to ${edu.endDate}`)
                    .moveDown();
            });

            drawLine(doc.y);

            // Experience Section
            doc.moveDown()
                .fillColor(primaryColor)
                .fontSize(subheaderFontSize)
                .font(fontFamily)
                .text('Experience');

            doc.fontSize(textFontSize);
            userData.experience.forEach(exp => {
                doc.text(`${exp.position} at ${exp.company}`)
                    .text(`${exp.startDate} to ${exp.endDate}`)
                    .text(exp.description)
                    .moveDown();
            });

            drawLine(doc.y);

            // Projects Section
            doc.moveDown()
                .fillColor(primaryColor)
                .fontSize(subheaderFontSize)
                .font(fontFamily)
                .text('Projects');

            doc.fontSize(textFontSize);
            userData.projects.forEach(proj => {
                doc.text(proj.title)
                    .text(proj.description)
                    .moveDown();
            });

        } else {
            doc.text('No user data found');
        }
        doc.end(); // End the PDF document generation
    }).catch(error => {
        console.error('Error retrieving user data:', error);
        doc.text('Error retrieving user data');
        doc.end(); // End the PDF document generation in case of an error
    });
};
