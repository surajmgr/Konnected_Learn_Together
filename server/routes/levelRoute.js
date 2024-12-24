const express = require('express');
const level_route = express();
const level_controller = require('../controllers/levelController');

level_route.get("/", level_controller.getLevels)

module.exports = level_route;