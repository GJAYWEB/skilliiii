const { Router } = require('express');
const route = Router();
const resumeDownladController = require('../controllers/resumeDownloadController');
const is_Authorized = require('../middlewares/is_Authorized');


route.get("/api/resume/download", is_Authorized, resumeDownladController.pdfKit);

module.exports = route;
