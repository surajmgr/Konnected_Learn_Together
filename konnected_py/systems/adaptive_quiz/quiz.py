import math
import random
import numpy as np
import pandas as pd
from systems.database.database import Database
from systems.adaptive_quiz.quiz_database import QuizDatabaseHandler
from systems.adaptive_quiz.irt_model import IRTModel

class QuizAdaptiveHandler:
    def __init__(self, db=None):
        self.quiz_db = QuizDatabaseHandler(db)
        self.irt_model = IRTModel()
        
    def weighted_sampling_without_replacement(self,questions, probabilities, information_values, total_questions):
        selected_questions = []
        
        # Convert probabilities to a numpy array for easier manipulation
        probabilities = np.array(probabilities)
        information_values = np.array(information_values)
        
        # normalization
        if sum(probabilities) != 1.0:
            probabilities = probabilities / probabilities.sum()
            
        for _ in range(min(total_questions, len(questions))):
            print("Probabilities: ", probabilities)
            print("Information Values: ", information_values)

            # Choose question with the highest information
            informative_index = np.argmax(information_values)

            print("Information Index: ", informative_index)
                    
            # Optionally bias towards mid-probability range
            mid_prob_indices = [i for i, p in enumerate(probabilities) if 0.2 <= p <= 0.8]
            if mid_prob_indices:
                # Choose question from mid-probability range with highest information
                informative_index = max(mid_prob_indices, key=lambda i: information_values[i])

            print("New Informative Index: ", informative_index)

            print()
            
            selected_questions.append(questions[informative_index])

            # Remove the chosen question and its probability
            questions.pop(informative_index)
            probabilities = np.delete(probabilities, informative_index)
            information_values = np.delete(information_values, informative_index)

            # Re-normalize probabilities if there are any left
            if len(probabilities) > 0:
                probabilities = probabilities / probabilities.sum()
        
        return selected_questions

    def select_subtopic_questions(self,topic, subtopic, student_id, total_questions, student_history_df, questions_df):
        # Filter student's history for the given topic and subtopic
        if student_history_df.empty:
            student_history = pd.DataFrame()
        else:
            student_history = student_history_df[(student_history_df['student_id'] == student_id) & 
                                                (student_history_df['topic_id'] == topic) &
                                                (student_history_df['subtopic_id'] == subtopic)]

        # Default to neutral theta if no history is available
        if student_history.empty:
            theta = 0.0
        else:
            theta = student_history.iloc[0]['theta']
                        
        # Filter questions data for the given topic and subtopic
        questions = questions_df[(questions_df['topic_id'] == topic) & 
                                (questions_df['subtopic_id'] == subtopic)].to_dict(orient='records')
        
        if not questions:
            print(f"No questions available for {topic} - {subtopic}.")
            return []
        
        # Calculate the probability of answering each question correctly
        probabilities = [self.irt_model.calculate_probability(q['discrimination'], q['difficulty'], q['guessing'], theta) 
                        for q in questions]

        # Calculate the information value of each question
        information_values = [self.irt_model.calculate_information(theta, q) for q in questions]
            
        # Check if all probabilities are zero to avoid division by zero
        if sum(probabilities) == 0:
            print(f"All probabilities are zero for {topic} - {subtopic}.")
            return []
        
        # Normalize
        probabilities = [p / sum(probabilities) for p in probabilities]

        selected_questions = self.weighted_sampling_without_replacement(questions, probabilities, information_values, total_questions)
        
        print(f"Selected {len(selected_questions)} questions for {topic} - {subtopic}.")
        
        return selected_questions

    def calculate_subtopic_weights(self,topic, student_id, subtopics, student_history_df):
        subtopic_weights = {subtopic: 1.0 for subtopic in subtopics}
        
        for subtopic in subtopics:
            # Get student's history for the current subtopic
            if student_history_df.empty:
                subtopic_history = pd.DataFrame()
            else:
                subtopic_history = student_history_df[(student_history_df['student_id'] == student_id) & 
                                                (student_history_df['topic_id'] == topic) &
                                                (student_history_df['subtopic_id'] == subtopic)]
                avg_theta = subtopic_history['theta'].mean()
                subtopic_weights[subtopic] = max(1.0, 2.0 - avg_theta)  # Inverse weighting: lower theta increases weight

        # Normalize weights
        total_weight = sum(subtopic_weights.values())
        if total_weight > 0:
            subtopic_weights = {subtopic: weight / total_weight for subtopic, weight in subtopic_weights.items()}
        
        return subtopic_weights

    def select_topic_questions(self,topic, student_id, questions_per_topic, student_history_df, questions_df):
        selected_questions = []
        
        # Get unique subtopics for the given topic
        subtopics = questions_df[questions_df['topic_id'] == topic]['subtopic_id'].unique()
        
        # Calculate subtopic weights based on student's history
        subtopic_weights = self.calculate_subtopic_weights(topic, student_id, subtopics, student_history_df)

        print(f"Subtopic Weights for {topic}: {subtopic_weights}")
        print(f"Subtopics length: {len(subtopics)}")
        
        # Allocate questions per subtopic based on weights
        for subtopic in subtopics:
            subtopic_weight = subtopic_weights[subtopic]
            subtopic_questions = max(1, math.ceil(questions_per_topic * subtopic_weight))  # Ensure at least 1 question
            
            # Select questions for the subtopic based on adaptive difficulty
            subtopic_selected_questions = self.select_subtopic_questions(
                topic, subtopic, student_id, subtopic_questions, student_history_df, questions_df
            )
            
            # Append the selected questions
            selected_questions.extend(subtopic_selected_questions)
        
        # Shuffle
        random.shuffle(selected_questions)
            
        # Limit
        if len(selected_questions) > questions_per_topic:
            selected_questions = selected_questions[:questions_per_topic]
        
        return selected_questions

    def final_main(self):
        # show a list of topic_id which are available for quiz
        query = "SELECT DISTINCT topic_id FROM quiz_questions"
        results = self.quiz_db.db.query_db(query)
        
        # Display the available topic IDs
        print("Available Topic IDs:")
        for i, topic_id in enumerate(results['topic_id']):
            print(f"{i}: {topic_id}")
        
        topic_id_sn = input("Enter the topic_id SN for which you want to take the quiz: ")
        topic_id = results['topic_id'][int(topic_id_sn)]

        print(f"Selected Topic ID: {topic_id}")

        print(self.quiz_db.fetch_quiz_questions(topic_id=topic_id))

        already_attempted_qid_correct_per_session = np.random.choice(self.quiz_db.fetch_quiz_questions(topic_id=topic_id)['id'], 5, replace=False)

        student_history_df = self.quiz_db.fetch_student_history(student_id=1,topic_id=topic_id)
        questions_df = self.quiz_db.fetch_quiz_questions(topic_id=topic_id)

        print(len(already_attempted_qid_correct_per_session))
        print(len(questions_df))

        # filter out the questions which are already attempted in the current session
        questions_df = questions_df[~questions_df['id'].isin(already_attempted_qid_correct_per_session)]
        print(len(questions_df))
        
        print(questions_df[:2])
        print(student_history_df[:2])

        # Select the number of questions to ask for each topic
        questions_per_topic = 5
        
        # Select questions for the given subject based on adaptive difficulty
        selected_questions = self.select_topic_questions(
            topic=topic_id,
            student_id=1,
            questions_per_topic=questions_per_topic,
            student_history_df=student_history_df,
            questions_df=questions_df
            )

        # Initialize a dictionary to store the student's answers
        user_answers = {}
        
        print(type(selected_questions))

        # convert list to DataFrame
        selected_questions = pd.DataFrame(selected_questions)
        # only print question, difficulty, discrimination, guessing, correct_answer
        print(selected_questions)

        for index, question in selected_questions.iterrows():
            print(f"Question ID: {question['id']}, Correct Answer: {question['answer']}")
            user_answer_option = input("Enter your answer: ")
            # if A, then options[0], if B, then options[1], if C, then options[2], if D, then options[3]
            user_answers[question['id']] = question['options'][ord(user_answer_option) - ord('A')]
            print(user_answers[question['id']])

        # Evaluate the student's answers
        self.check_answers(user_answers, 1)
            
    def calculate_params_update(self,student_id, question, status):
        # fetch student's history for the given topic and subtopic
        student_history = self.quiz_db.fetch_student_history(student_id=student_id, topic_id=question['topic_id'], subtopic_id=question['subtopic_id'])
        
        # default theta if no prior history exists
        current_theta = student_history['theta'].values[0] if not student_history.empty else 0.0
        
        # update the student's total number of questions and correct answers
        total = student_history['total'].values[0] + 1 if not student_history.empty else 1
        correct_total = student_history['correct'].values[0] + status if not student_history.empty else status
        
        # recalculate theta (ability)
        updated_theta = self.irt_model.calculate_theta(current_theta, question, correct_total, total, status)

        print(f"Question ID: {question['id']}, Current Theta: {current_theta}, Updated Theta: {updated_theta}")
        
        # update the student history
        self.quiz_db.update_student_history(student_id, question['topic_id'], question['subtopic_id'], correct_total, total, updated_theta)

        return updated_theta

    def check_answers(self,user_answers, student_id):
        keys = user_answers.keys()
        response = {
            "correct": [],
            "incorrect": [],
            "new_theta": {},
            "subtopic": {}
        }
        # Set
        subtopics_attached = set()
        topic_id = 0
        old_theta_subtopics = {}

        for key in keys:
            question = self.quiz_db.fetch_quiz_questions(id=key).iloc[0].to_dict()
            topic_id = question['topic_id'] if topic_id == 0 else topic_id
            subtopics_attached.add(question['subtopic_id'])
            ques_item = {
                "qid": question['id'],
                "answer": question['answer'],
                "a": question['discrimination'],
                "b": question['difficulty'],
                "c": question['guessing'],
                "subtopic": question['subtopic_id'],
                "new_theta": 0.0
            }
            old_theta = self.quiz_db.fetch_theta(student_id, question['subtopic_id'])
            
            # check if old_theta for the subtopic is already fetched
            if question['subtopic_id'] not in old_theta_subtopics:
                if old_theta.empty or old_theta is None:
                    old_theta = 0.0
                else:
                    old_theta = old_theta['theta'].values[0]
                print(f"Old Theta: {old_theta}")
                old_theta_subtopics[question['subtopic_id']] = old_theta
            else:
                old_theta = old_theta_subtopics[question['subtopic_id']]

            print(f"Old Theta: {old_theta}")

            if question['answer'] == user_answers[key]:
                print(f"Correct! Question ID: {key}")
                new_theta = self.calculate_params_update(student_id, question, 1)
                # response["new_theta"][key] = new_theta
                ques_item["new_theta"] = new_theta
                response["correct"].append(ques_item)
            else:
                print(f"Incorrect! Question ID: {key}")
                new_theta = self.calculate_params_update(student_id, question, 0)
                # response["new_theta"][key] = new_theta
                ques_item["new_theta"] = new_theta
                response["incorrect"].append(ques_item)

        # For each subtopic, fetch the student's history and subtopic information
        for subtopic_id in subtopics_attached:
            student_history = self.quiz_db.fetch_student_history(student_id=student_id, topic_id=topic_id, subtopic_id=subtopic_id)
            subtopic_info = self.quiz_db.fetch_subtopic_info(subtopic_id)
            # print(f"Subtopic ID: {subtopic_id}, Student History: {student_history}, Subtopic Info: {subtopic_info}")

            # "message":"'float' object has no attribute 'empty'"
            print(f"Old Theta Subtopics: {old_theta_subtopics}")

            # if old_theta[subtopic_id] has theta ke

            print(f"Old Theta Subtopics: {old_theta_subtopics}")

            response["subtopic"][subtopic_id] = {
                "old_theta": old_theta_subtopics[subtopic_id],
                "history": {
                    # convert to int to avoid numpy int64 serialization issue
                    "correct": int(student_history['correct'].values[0]) if not student_history.empty else 0,
                    "total": int(student_history['total'].values[0]) if not student_history.empty else 0,
                    "theta": student_history['theta'].values[0] if not student_history.empty else 0.0
                },
                "info": {
                    "name": subtopic_info['name'].values[0],
                    "sst_name": subtopic_info['sst_name'].values[0],
                }
            }

            print(f"Results: {response}")
            
        print(f"Results: {response}")
        return response
