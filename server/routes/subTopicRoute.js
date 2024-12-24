const express = require('express');
const subTopic_route = express();
const subTopic_controller = require('../controllers/subTopicController');

subTopic_route.get("/", subTopic_controller.getAllSubTopics)
subTopic_route.get("/:tid", subTopic_controller.getSubTopics)
subTopic_route.get("/:tname/:name/:id", subTopic_controller.getSubTopic)
subTopic_route.post("/add-subtopic", subTopic_controller.addSubTopic)

module.exports = subTopic_route;