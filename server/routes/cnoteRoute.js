const express = require('express');
const cnote_route = express();
const cnote_controller = require('../controllers/cnoteController');

cnote_route.post("/", cnote_controller.addNote)
cnote_route.delete("/:id", cnote_controller.deleteNote)
cnote_route.put("/:id", cnote_controller.updateNote)

module.exports = cnote_route;