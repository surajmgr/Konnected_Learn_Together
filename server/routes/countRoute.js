const express = require('express');
const count_route = express();
const count_controller = require('../controllers/countController');

count_route.get("/subtopic/:tid", count_controller.getStCount)
count_route.get("/notes/:tid", count_controller.getNTCount)
count_route.get("/notes/:tid/:stid", count_controller.getNTSCount)
// count_route.get("/questions/:tid", count_controller.getQCount)
count_route.get("/contributors/:stid", count_controller.getCCount)
count_route.get("/contributions/:uid", count_controller.getNCCount)
count_route.get("/votes/:aid", count_controller.getVCount)
count_route.get("/questions/:tid", count_controller.getQCount)
count_route.get("/answers/:qid", count_controller.getACount)
count_route.get("/books/:lid", count_controller.getBCount)

module.exports = count_route;