import re
from collections import Counter
import numpy as np
from consts.stopwords import STOP_WORDS

class PrepareData:
    def __init__(self, top_n=10, text_format='plain', attributes=None, keys=None, min_doc_freq=2):
        self.top_n = top_n
        self.text_format = text_format
        self.idf = {}
        self.attributes = attributes if attributes else ["title", "description"]
        self.keys = keys if keys else ["id", "keywords"]
        self.min_doc_freq = min_doc_freq  # Minimum document frequency to consider terms

    def _clean_text(self, text):
        text = text.lower()
        text = re.sub(r"<.*?>", "", text)  # Remove HTML tags
        text = re.sub(r"[^a-z0-9\s]", "", text)  # Remove non-alphanumeric characters
        words = text.split()
        words = [word for word in words if word not in STOP_WORDS]  # Remove stopwords
        return words

    def _combine_attributes(self, doc):
        combined_text = []
        for attr in self.attributes:
            value = doc.get(attr, "")
            if isinstance(value, list):
                combined_text.extend(value)
            else:
                combined_text.extend(value.split())  # Tokenize string attributes
        return " ".join(combined_text)

    def fit(self, documents):
        corpus = [self._clean_text(self._combine_attributes(doc)) for doc in documents]
        total_docs = len(corpus)
        word_doc_count = Counter()

        for doc in corpus:
            unique_words = set(doc)
            for word in unique_words:
                word_doc_count[word] += 1

        # Compute IDF (Inverse Document Frequency) values with smoothing
        self.idf = {
            word: np.log(1 + total_docs / (count + 1))  # Smoothed IDF
            for word, count in word_doc_count.items()
        }

        self.corpus = corpus

    def transform(self, documents):
        processed_documents = []
        for doc in documents:
            text = self._combine_attributes(doc)
            words = self._clean_text(text)
            word_tf = Counter(words)
            total_words = sum(word_tf.values())
            tf_scores = {word: count / total_words for word, count in word_tf.items()}

            # Compute TF-IDF scores using document-specific TF
            tfidf_scores = {
                word: tf_scores[word] * self.idf.get(word, 0) for word in words
            }

            # Filter out terms that appear in too few documents
            filtered_tfidf = {word: score for word, score in tfidf_scores.items() if sum(1 for doc in self.corpus if word in doc) >= self.min_doc_freq}

            # Normalize TF-IDF scores (L2 normalization)
            norm = np.linalg.norm(list(filtered_tfidf.values()))
            if norm > 0:
                filtered_tfidf = {word: score / norm for word, score in filtered_tfidf.items()}

            # Threshold based on TF-IDF score distribution (adjustable percentile)
            min_tfidf_threshold = max(0.100, np.percentile(list(filtered_tfidf.values()), 20))
            filtered_tfidf = {word: score for word, score in filtered_tfidf.items() if score >= min_tfidf_threshold}

            # Extract top N keywords
            top_keywords = sorted(filtered_tfidf, key=filtered_tfidf.get, reverse=True)[:self.top_n]

            # Collect document data and keywords
            processed_doc = {key: doc.get(key, "") for key in self.keys}
            # processed_doc["keywords"] = [f"{word} ({filtered_tfidf[word]:.3f})" for word in top_keywords]
            processed_doc["keywords"] = top_keywords
            processed_documents.append(processed_doc)

        return processed_documents
