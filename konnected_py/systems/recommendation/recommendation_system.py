import pickle
import numpy as np
import pandas as pd
import time
import random
import json

class RecommendationSystem:
    def __init__(self, k=2, metric="cosine", vectorize_attrs=None, keys=None, categorical_attrs=None):
        self.k = k
        self.metric = metric
        self.items = []
        self.feature_matrix = None
        self.categorical_feature_matrix = None
        self.non_categorical_feature_matrix = None
        self.vocab_index = {}
        self.categorical_index = {}
        self.vectorize_attrs = vectorize_attrs if vectorize_attrs else ["keywords", "audience_level", "subject"]
        self.categorical_attrs = categorical_attrs if categorical_attrs else ["audience_level", "subject"]
        self.keys = keys if keys else {"id": "book_id", "keywords": "keywords", "model_name": "model"}
        self.model_name = f"{self.keys['model_name']}_recommender_model.pkl"
    
    def vectorize_items(self):
        vocabulary = set()
        # One-hot encode categorical attributes
        categorical_vocab = set()

        # Build vocabularies
        for item in self.items:
            for attr in self.vectorize_attrs:
                value = item.get(attr)
                if attr in self.categorical_attrs:
                    if isinstance(value, list):
                        categorical_vocab.update(value)
                    else:
                        categorical_vocab.add(value)
                else:
                    if isinstance(value, list):
                        vocabulary.update(value)
                    else:
                        vocabulary.add(value)

        # Create vocabularies for indices
        self.vocab_index = {term: idx for idx, term in enumerate(vocabulary)}
        self.categorical_index = {term: idx for idx, term in enumerate(categorical_vocab)}
        
        # Build feature matrix
        self.categorical_feature_matrix = []
        self.non_categorical_feature_matrix = []

        for item in self.items:
            categorical_vector = [0] * len(self.categorical_index)
            non_categorical_vector = [0] * len(self.vocab_index)

            for attr in self.vectorize_attrs:
                value = item.get(attr)
                if attr in self.categorical_attrs:
                    if isinstance(value, list):
                        for cat in value:
                            if cat in self.categorical_index:
                                categorical_vector[self.categorical_index[cat]] = 1
                    elif value in self.categorical_index:
                        categorical_vector[self.categorical_index[value]] = 1
                else:
                    if isinstance(value, list):
                        for term in value:
                            if term in self.vocab_index:
                                non_categorical_vector[self.vocab_index[term]] += 1
                    else:
                        if value in self.vocab_index:
                            non_categorical_vector[self.vocab_index[value]] += value

            self.categorical_feature_matrix.append(categorical_vector)
            self.non_categorical_feature_matrix.append(non_categorical_vector)

        self.categorical_feature_matrix = np.array(self.categorical_feature_matrix)
        self.non_categorical_feature_matrix = np.array(self.non_categorical_feature_matrix)
        
    def fit(self, items):
        self.items = items
        self.vectorize_items()

    def compute_distances(self, x, y):
        x = np.array(x) # categorical vector
        y = np.array(y) # non-categorical vector

        def normalize(v):
            norm = np.linalg.norm(v)
            return v / norm if norm != 0 else v

        if self.metric == "euclidean":
            return np.sqrt(np.sum((self.feature_matrix - x) ** 2, axis=1))
        elif self.metric == "manhattan":
            return np.sum(np.abs(self.feature_matrix - x), axis=1)
        elif self.metric == "cosine":
            cat_weight = 0.7
            non_cat_weight = 1 - cat_weight
            
            cat_norm = normalize(x)
            non_cat_norm = normalize(y)

            cat_similarity = np.dot(self.categorical_feature_matrix, cat_norm)
            non_cat_similarity = np.dot(self.non_categorical_feature_matrix, non_cat_norm)
            
            cat_distance = 1 - cat_similarity
            non_cat_distance = 1 - non_cat_similarity

            return cat_weight * cat_distance + non_cat_weight * non_cat_distance
        else:
            raise ValueError(f"Unknown metric: {self.metric}")

    def recommend(self, item_id, limit=5):
        # Fetch the target item
        item = next(item for item in self.items if item[self.keys["id"]] == item_id)
        print(f"Recommendations for {item_id}:")

        # Fetch the feature vectors for the target item
        categorical_vector = self.categorical_feature_matrix[self.items.index(item)]
        non_categorical_vector = self.non_categorical_feature_matrix[self.items.index(item)]

        # Compute distances and find neighbors
        distances = self.compute_distances(categorical_vector, non_categorical_vector)
        neighbor_indices = np.argsort(distances)[: self.k + 1]

        # Identify and display the reasons for recommendations
        print(f"Recommendation reason for {item_id}:")
        for i in neighbor_indices:
            if self.items[i][self.keys['id']] == item_id:
                continue  # Skip the target item itself
            print(f"Reason for recommending {self.items[i][self.keys['id']]}:")

            # Helper function to find shared features
            def shared_features(vector_a, vector_b, index_mapping, label):
                reasons = []
                for j, feature in enumerate(vector_a):
                    if feature == 1 and vector_b[j] == 1:
                        feature_name = list(index_mapping.keys())[j]
                        reasons.append(feature_name)
                if reasons:
                    print(f"  {label}:")
                    for reason in reasons:
                        print(f"    {reason}")

            # Check for shared features
            shared_features(
                self.non_categorical_feature_matrix[i],
                non_categorical_vector,
                self.vocab_index,
                "Non-categorical features",
            )
            shared_features(
                self.categorical_feature_matrix[i],
                categorical_vector,
                self.categorical_index,
                "Categorical features",
            )
            print("\n")

        # Print distances to neighbors
        for i in neighbor_indices:
            print(f"Distance to {self.items[i][self.keys['id']]}: {distances[i]:.2f}")

        # Generate recommendations (excluding the target item)
        recommendations = [
            self.items[i][self.keys["id"]]
            for i in neighbor_indices
            if self.items[i][self.keys["id"]] != item_id
        ][:limit]

        # self.calculate_all_distances()

        return recommendations
    
    def calculate_all_distances(self):
        # Compute matrix of distances between all items, with shape (n_items, n_items) and label each item with its ID
        distances = np.zeros((len(self.items), len(self.items)))
        item_ids = [item[self.keys["id"]] for item in self.items]

        for i, item in enumerate(self.items):
            categorical_vector = self.categorical_feature_matrix[i]
            non_categorical_vector = self.non_categorical_feature_matrix[i]
            distances[i] = self.compute_distances(categorical_vector, non_categorical_vector)

        distances_df = pd.DataFrame(distances, index=item_ids, columns=item_ids)
        # save the distances to a CSV file
        distances_df.to_csv(f"assets/data/{self.keys['model_name']}_distances.csv")

    def update_items(self, new_items):
        self.items.extend(new_items)
        self.vectorize_items()

    def save_model(self):
        with open("assets/models/" + self.model_name, "wb") as f:
            pickle.dump((self.items, self.categorical_feature_matrix, self.non_categorical_feature_matrix, self.vocab_index, self.categorical_index), f)

    def load_model(self):
        with open("assets/models/" + self.model_name, "rb") as f:
            self.items, self.categorical_feature_matrix, self.non_categorical_feature_matrix, self.vocab_index, self.categorical_index = pickle.load(f)

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