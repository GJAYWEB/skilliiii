const { Router } = require('express');
const route = Router();
const userController = require('../controllers/userController');
const is_auth = require('../middlewares/is_Authorized');

route.get("/api/user/userName", is_auth, userController.userName);

route.post("/api/user/login", userController.authentication);

route.post("/api/user/signin", userController.signin);

route.post("/api/user/emailVarifier", userController.emailVarifier)

route.get('/api/user/logout', userController.logout);

route.post('/api/user/forgotPassword', is_auth, userController.forgotPassword)

route.get('/api/user/changePassword/:token' , userController.resetPassGetToken)

module.exports = route;