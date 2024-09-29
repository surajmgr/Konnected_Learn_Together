const express = require('express');
const recommend_route = express();
const recommend_controller = require('../controllers/recommendController.js');

recommend_route.get("/book",recommend_controller.recommendBooks);

module.exports = recommend_route;