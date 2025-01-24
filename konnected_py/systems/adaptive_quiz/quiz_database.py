from systems.database.database import Database

class QuizDatabaseHandler:
    def __init__(self, db=None):
        self.db = Database() if db is None else db

    def fetch_quiz_questions(self,id=None,topic_id = None, subtopic_id = None):
        query = "SELECT * FROM quiz_questions"
        values = ()
        
        if topic_id is not None:
            query += f" WHERE topic_id = %s"
            values = (topic_id,)
            
            if subtopic_id is not None:
                query += f" AND subtopic_id = %s"
                values += (subtopic_id,)
        elif id is not None:
            query += f" WHERE id = %s"
            values = (id,)

        results = self.db.query_db(query, values)

        return results

    def fetch_subtopic_info(self, subtopic_id):
        query = "SELECT * FROM subtopics WHERE id = %s"
        values = (subtopic_id,)

        results = self.db.query_db(query, values)
        
        return results

    def fetch_student_history(self,student_id = None, topic_id = None, subtopic_id = None, conn = None):
        query = "SELECT * FROM student_history"
        values = ()
        
        if student_id is not None:
            query += f" WHERE student_id = %s"
            values = (student_id,)
            
            if topic_id is not None:
                query += f" AND topic_id = %s"
                values += (topic_id,)
                
                if subtopic_id is not None:
                    query += f" AND subtopic_id = %s"
                    values += (subtopic_id,)

        results = self.db.query_db(query, values)

        return results

    def fetch_theta(self,student_id, subtopic_id):
        query = "SELECT theta FROM student_history WHERE student_id = %s AND subtopic_id = %s"
        values = (student_id, subtopic_id)

        results = self.db.query_db(query, values)

        return results

    def update_student_history(self,student_id, topic_id, subtopic_id, correct, total, theta):
        student_history = self.fetch_student_history(student_id, topic_id, subtopic_id)
        # query = f"INSERT INTO student_history (student_id, topic_id, subtopic_id, correct, total, theta) VALUES ({student_id}, '{topic_id}', '{subtopic_id}', {correct}, {total}, {theta})" if student_history.empty else f"UPDATE student_history SET correct = {correct}, total = {total}, theta = {theta} WHERE student_id = {student_id} AND topic_id = '{topic_id}' AND subtopic_id = '{subtopic_id}'"
        query = f"INSERT INTO student_history (student_id, topic_id, subtopic_id, correct, total, theta) VALUES (%s, %s, %s, %s, %s, %s)" if student_history.empty else f"UPDATE student_history SET correct = %s, total = %s, theta = %s WHERE student_id = %s AND topic_id = %s AND subtopic_id = %s"
        values = (student_id, topic_id, subtopic_id, correct, total, theta) if student_history.empty else (correct, total, theta, student_id, topic_id, subtopic_id)
        
        results = self.db.query_db(query, values)
        
        return results

    def book_info(self):
        query = "SELECT b.name AS book_name, t.name AS topic_name, s.name AS subtopic_name, s.id AS subtopic_id, t.id AS topic_id FROM books b JOIN topicbook tb ON b.id = tb.book_id JOIN topics t ON tb.topic_id = t.id JOIN subtopics s ON s.topic = t.id ORDER BY b.name, t.name, s.name;"
        results = self.db.query_db(query)

        return results

    def upload_questions(self,questions, conn=None):
        query = """
        INSERT INTO quiz_questions 
        (topic_id, subtopic_id, question, answer, options, difficulty, discrimination, guessing) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values = []
        for subtopic_question in questions:
            for question in subtopic_question['questions']:
                values.append((
                    subtopic_question['topic_id'],
                    subtopic_question['subtopic_id'],
                    question['question'],
                    question['answer'],
                    question['options'],
                    round(question['difficulty'], 2),
                    round(question['discrimination'], 2),
                    round(question['guessing'], 2)
                ))
        
        results = self.db.query_db(query, values)

        return results
