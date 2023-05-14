const express = require('express');
const topic_route = express();
const topic_controller = require('../controllers/topicController');

topic_route.get("/", topic_controller.getAllTopics)
topic_route.get("/:bid", topic_controller.getTopics)
topic_route.get("/:name/:id", topic_controller.getTopic)
topic_route.post("/add-topic", topic_controller.addTopic)

module.exports = topic_route;