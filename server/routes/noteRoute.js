const express = require('express');
const note_route = express();
const note_controller = require('../controllers/noteController');

note_route.get("/", note_controller.getAllNotes)
note_route.get("/:stid", note_controller.getNotes)
note_route.get("/display/:stid", note_controller.getDisplayNote)
note_route.get("/:name/:id", note_controller.getNote)

module.exports = note_route;