const express = require('express');
const yt_route = express();
const yt_controller = require('../controllers/ytController.js');

yt_route.get("/", yt_controller.getSearchResults)

module.exports = yt_route;