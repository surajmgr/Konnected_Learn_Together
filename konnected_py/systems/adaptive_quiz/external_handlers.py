import pandas as pd
from systems.adaptive_quiz.quiz import QuizAdaptiveHandler

# external handlers
def getQuiz(topic_id, student_id, already_attempted=None, total_questions=None):
    quizAdaptiveHandler = QuizAdaptiveHandler()

    print(f"Selected Topic ID: {topic_id}")

    already_attempted_qid_correct_per_session = already_attempted if already_attempted else []

    student_history_df = quizAdaptiveHandler.quiz_db.fetch_student_history(student_id=student_id,topic_id=topic_id)
    questions_df = quizAdaptiveHandler.quiz_db.fetch_quiz_questions(topic_id=topic_id)
    
    print("Already Attempted: ", already_attempted)
    print("Student History: ", student_history_df)
    print("Questions for topic: ", len(questions_df))

    # if no questions are available for the given topic, return empty list
    if len(questions_df) == 0:
        return []

    # filter out the questions which are already attempted in the current session
    questions_df = questions_df[~questions_df['id'].isin(already_attempted_qid_correct_per_session)]
    print("Not Attempted Questions: ", len(questions_df))

    # if all questions are attempted, reset the session
    if len(questions_df) == 0:
        already_attempted_qid_correct_per_session = []
        questions_df = quizAdaptiveHandler.quiz_db.fetch_quiz_questions(topic_id=topic_id)
        print("Resetting Session")
    
    print(questions_df[:5])
    print(student_history_df[:2])

    # Select the number of questions to ask for each topic
    questions_per_topic = total_questions if total_questions else 5

    # Select questions for the given subject based on adaptive difficulty
    selected_questions = quizAdaptiveHandler.select_topic_questions(
        topic=topic_id,
        student_id=1,
        questions_per_topic=questions_per_topic,
        student_history_df=student_history_df,
        questions_df=questions_df
        )

    print(selected_questions)

    # quizAdaptiveHandler.final_main()
    
    return selected_questions

def checkAnswer(user_answers, student_id):
    quizAdaptiveHandler = QuizAdaptiveHandler()
    print("User Answers: ", user_answers)
    print("Student ID: ", student_id)
    return quizAdaptiveHandler.check_answers(user_answers, student_id)