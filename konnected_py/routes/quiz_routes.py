from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from systems.adaptive_quiz.external_handlers import getQuiz, checkAnswer

router = APIRouter()

class QuizRequest(BaseModel):
    topic_id: str
    student_id: str
    already_attempted: List[str] = []
    total_questions: int = 5

"""
Format for QuizRequest:
{
    "topic_id": "topic_id",
    "student_id": "student_id",
    "already_attempted": ["qid1", "qid2"],
    "total_questions": 5
}
"""
    
@router.post("/start")
async def startQuiz(quiz_request: QuizRequest):
    try:
        topic_id = quiz_request.topic_id
        student_id = quiz_request.student_id
        already_attempted = quiz_request.already_attempted
        total_questions = quiz_request.total_questions
        
        quiz = getQuiz(topic_id, student_id, already_attempted, total_questions)
        
        return quiz
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )

class AnswerRequest(BaseModel):
    user_answers: Dict[str, str]
    student_id: str

"""
Format for AnswerRequest:
{
    "user_answers": {
        "qid1": "option1",
        "qid2": "option2"
    },
    "student_id": "student_id"
}
"""

@router.post("/check")
async def validateQuiz(answer_request: AnswerRequest):
    try:
        user_answers = answer_request.user_answers
        student_id = answer_request.student_id
        
        result = checkAnswer(user_answers, student_id)
        
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )

"""
    Create Documentation for the Quiz System API
    - Start Quiz
        The path for this endpoint is /quiz/start, and it accepts a POST request with a JSON body containing the following fields:
            - topic_id: The ID of the topic for which the quiz is being started.
            - student_id: The ID of the student taking the quiz.
            - already_attempted: An optional list of question IDs that the student has already attempted and is correct in the current session.
            - total_questions: The total number of questions to be included in the quiz. Default value is 5.
        The response will be a JSON object containing the selected questions for the quiz, with format:
            
    - Validate Quiz
"""