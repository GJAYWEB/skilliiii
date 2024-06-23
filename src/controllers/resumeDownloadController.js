const pdfService = require("../services/pdf-service");

exports.pdfKit = (req, res, next) => {
    res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment;filename="resume.pdf"',
    });

    const stream = res;

    pdfService(req,
        (chunk) => stream.write(chunk),
        () => stream.end()
    );
};
