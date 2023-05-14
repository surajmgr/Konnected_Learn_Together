const express = require('express');
const search_route = express();
const search_controller = require('../controllers/searchController');

search_route.get("/", search_controller.getQuery)

module.exports = search_route;