const express = require('express');
const question_route = express();
const question_controller = require('../controllers/questionController');

question_route.get("/:tid", question_controller.getQuestions)
question_route.get("/:qname/:qid", question_controller.getQuestion)
question_route.get("/answers/:qid/1", question_controller.getAnswers)
question_route.post("/update-vote", question_controller.updateVote)
question_route.post("/post", question_controller.addQuestion)
question_route.delete("/post/:id", question_controller.deleteQuestion)
question_route.put("/post/:id", question_controller.updateQuestion)
question_route.post("/answer", question_controller.addAnswer)
question_route.delete("/answer/:id", question_controller.deleteAnswer)
question_route.put("/answer/:id", question_controller.updateAnswer)

module.exports = question_route;