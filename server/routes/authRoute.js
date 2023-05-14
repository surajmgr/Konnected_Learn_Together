const express = require('express');
const auth_route = express();
const auth_controller = require('../controllers/authController');

auth_route.post("/register",auth_controller.register);
auth_route.post("/login",auth_controller.login);
auth_route.post("/logout",auth_controller.logout);

auth_route.get('/activate-account', auth_controller.loadActivateAccount);

auth_route.post('/reset-password', auth_controller.resetPassword);

module.exports = auth_route;