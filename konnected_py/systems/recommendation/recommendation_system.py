import pickle
import numpy as np
import time
import random
import json

class RecommendationSystem:
    def __init__(self, k=2, metric="euclidean", vectorize_attrs=None, keys=None):
        self.k = k
        self.metric = metric
        self.items = []
        self.feature_matrix = None
        self.vocab_index = {}
        self.vectorize_attrs = vectorize_attrs if vectorize_attrs else ["keywords", "audience_level", "subject"]
        self.keys = keys if keys else {"id": "book_id", "keywords": "keywords", "model_name": "model"}
        self.model_name = f"{self.keys['model_name']}_recommender_model.pkl"

    def vectorize_items(self):
        vocabulary = set()
        for item in self.items:
            for attr in self.vectorize_attrs:
                value = item.get(attr)
                if isinstance(value, list):
                    vocabulary.update(value)
                elif isinstance(value, (float, int)):
                    vocabulary.add(value)

        self.vocab_index = {term: idx for idx, term in enumerate(vocabulary)}
        self.feature_matrix = []
        for item in self.items:
            vector = [0] * len(self.vocab_index)
            for attr in self.vectorize_attrs:
                value = item.get(attr)
                if isinstance(value, list):
                    for term in value:
                        if term in self.vocab_index:
                            vector[self.vocab_index[term]] += 1
                elif isinstance(value, (float, int)):
                    if value in self.vocab_index:
                        vector[self.vocab_index[value]] += value
            self.feature_matrix.append(vector)

        self.feature_matrix = np.array(self.feature_matrix)

    def fit(self, items):
        self.items = items
        self.vectorize_items()

    def compute_distances(self, x):
        x = np.array(x)
        if self.metric == "euclidean":
            return np.sqrt(np.sum((self.feature_matrix - x) ** 2, axis=1))
        elif self.metric == "manhattan":
            return np.sum(np.abs(self.feature_matrix - x), axis=1)
        elif self.metric == "cosine":
            x_norm = np.linalg.norm(x)
            matrix_norms = np.linalg.norm(self.feature_matrix, axis=1)
            return 1 - np.dot(self.feature_matrix, x) / (matrix_norms * x_norm)
        else:
            raise ValueError(f"Unknown metric: {self.metric}")

    def recommend(self, item_id, limit=5):
        item = next(item for item in self.items if item[self.keys["id"]] == item_id)
        item_vector = self.feature_matrix[self.items.index(item)]
        distances = self.compute_distances(item_vector)
        neighbor_indices = np.argsort(distances)[: self.k + 1]
        recommendations = [
            self.items[i][self.keys["id"]]
            for i in neighbor_indices
            if self.items[i][self.keys["id"]] != item_id
        ][:limit]
        return recommendations

    def update_items(self, new_items):
        self.items.extend(new_items)
        self.vectorize_items()

    def save_model(self):
        with open("assets/models/" + self.model_name, "wb") as f:
            pickle.dump((self.items, self.feature_matrix, self.vocab_index), f)

    def load_model(self):
        with open("assets/models/" + self.model_name, "rb") as f:
            self.items, self.feature_matrix, self.vocab_index = pickle.load(f)

    def train_model(self, items):
        self.fit(items)
        self.save_model()
        print(f"Model trained and saved successfully as {self.model_name}.")

    def load_and_recommend(self, item_id):
        self.load_model()
        recommendations = self.recommend(item_id)
        return recommendations

    def generate_synthetic_data(self, num_records):
        """Generate synthetic data for benchmarking."""
        items = []
        if self.keys['model_name'] == "book":
            for i in range(num_records):
                item = {
                    "book_id": f"book_{i}",
                    "keywords": [f"keyword_{random.randint(1, 10)}" for _ in range(random.randint(1, 5))],
                    "audience_level": [random.choice(["beginner", "intermediate", "advanced"]) for _ in range(random.randint(0, 2))],
                    "subject": [random.choice(["math", "science", "history"]) for _ in range(random.randint(0, 2))],
                }
                items.append(item)
        elif self.keys['model_name'] == "note":
            for i in range(num_records):
                item = {
                    "note_id": f"note_{i}",
                    "subtopic_id": f"subtopic_{random.randint(1, 10)}",
                    "keywords": [f"keyword_{random.randint(1, 10)}" for _ in range(random.randint(1, 5))],
                    "connected_notes": [f"note_{random.randint(1, num_records)}" for _ in range(random.randint(1, 5))],
                    "relevance_score": random.uniform(0, 1),
                    "subject": [random.choice(["math", "science", "history"]) for _ in range(random.randint(0, 2))],
                    "audience_level": [random.choice(["beginner", "intermediate", "advanced"]) for _ in range(random.randint(0, 2))],
                }
                items.append(item)
        
        # save the synthetic data
        with open(f"assets/data/synthetic_{self.keys['model_name']}s.json", "w") as f:
            json.dump(items, f)
        return items

    def benchmark(self, num_records):
        """Benchmark the system for a given number of records."""
        print(f"Benchmarking with {num_records} records...")
        
        try:
            with open(f"assets/data/synthetic_{self.keys['model_name']}s.json", "r") as f:
                items = json.load(f)
        except FileNotFoundError:
            items = self.generate_synthetic_data(num_records)
        print(f"Generated synthetic data for {num_records} {self.keys['model_name']}s.")
        
        self.model_name = f"synthetic_{self.model_name}"
        start_time = time.time()
        try:
            self.load_model()
        except FileNotFoundError:
            self.train_model(items)
        train_time = time.time() - start_time
        print(f"Time to train model: {train_time:.2f} seconds")

        # test recommendation
        item_id = items[0][self.keys['id']]
        start_time = time.time()
        recommendations = self.recommend(item_id)
        recommend_time = time.time() - start_time
        print(f"Time to recommend for item {item_id}: {recommend_time:.2f} seconds")
        print(f"Recommendations: {recommendations}")