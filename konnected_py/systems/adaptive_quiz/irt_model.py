import numpy as np

class IRTModel:
    def __init__(self):
        self.beta_sensitivity = 0.1
        self.learning_rate = 0.1
        
    # 3PL IRT functions
    def calculate_probability(self,a, b, c, theta):
        return c + (1 - c) / (1 + np.exp(-a * (theta - b)))

    # Function to update the student's ability (theta) based on their performance
    def calculate_theta(self,theta, question, correct_total, total_attempted, answer):
        # expression to calculate the learning rate based on performance
        learning_rate = self.learning_rate if total_attempted <= 1 else 1 / (1 + self.beta_sensitivity * (total_attempted - correct_total) / total_attempted)
        
        # calculate the total impact of the question's parameters (a, b, c)
        a = question['discrimination']
        b = question['difficulty']
        c = question['guessing']
        p = self.calculate_probability(a, b, c, theta)  # predicted probability for correct answer
        
        # Assume the answer is either 1 (correct) or 0 (incorrect)
        
        # Calculate the gradient based on the answer
        gradient = a * (answer - p)  # Update formula for the gradient
        
        # Update the student's ability (theta)
        updated_theta = theta + learning_rate * gradient
        return updated_theta

    # Calculate information of a question at a given ability level
    def calculate_information(self,theta, question):
        a = question['discrimination']
        prob = self.calculate_probability(a, question['difficulty'], question['guessing'], theta)
        information = (a ** 2) * (prob * (1 - prob))  # Simplified information function
        return information

