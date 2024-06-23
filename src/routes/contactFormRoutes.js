const { Router } = require('express');
const route = Router();
const contactFormController = require('../controllers/contactFormController');
const is_Authorized = require('../middlewares/is_Authorized')

route.post("/api/contact", is_Authorized, contactFormController.contact);

module.exports = route;