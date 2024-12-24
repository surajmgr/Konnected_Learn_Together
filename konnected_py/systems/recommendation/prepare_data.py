import re
from collections import Counter
import numpy as np
from consts.stopwords import STOP_WORDS

class PrepareData:
    def __init__(self, top_n=10, text_format='plain', attributes=None, keys=None):
        self.top_n = top_n
        self.text_format = text_format
        self.idf = {}
        self.attributes = attributes if attributes else ["title", "description"]
        self.keys = keys if keys else ["id", "keywords"]

    def _clean_text(self, text):
        # Convert to lowercase
        text = text.lower()

        # Remove non-alphanumeric characters based on text format
        if self.text_format == 'html':
            text = re.sub(r"<.*?>", "", text)  # Remove HTML tags
        elif self.text_format == 'md':
            text = re.sub(r"[\*_\[\]\(\)!#]", "", text)  # Remove Markdown symbols

        # Remove any remaining non-alphanumeric characters
        text = re.sub(r"[^a-z0-9\s]", "", text)

        # Remove stop words
        words = text.split()
        words = [word for word in words if word not in STOP_WORDS]
        return words

    def _combine_attributes(self, doc):
        combined_text = []
        for attr in self.attributes:
            value = doc.get(attr, "")
            if isinstance(value, list):
                combined_text.extend(value)
            else:
                combined_text.extend(value.split())
        return " ".join(combined_text)

    def fit(self, documents):
        # Create a corpus of all documents' combined text
        corpus = []
        for doc in documents:
            text = self._combine_attributes(doc)
            corpus.append(self._clean_text(text))

        # Compute IDF for each word
        total_docs = len(corpus)
        word_doc_count = Counter()
        for doc in corpus:
            unique_words = set(doc)
            for word in unique_words:
                word_doc_count[word] += 1

        for word, count in word_doc_count.items():
            self.idf[word] = np.log(total_docs / float(count))

        self.corpus = corpus

    def transform(self, documents):
        processed_documents = []

        for idx, doc in enumerate(documents):
            text = self._combine_attributes(doc)
            words = self._clean_text(text)

            # Compute TF for each word
            word_tf = Counter(words)
            max_tf = max(word_tf.values())
            for word in word_tf:
                word_tf[word] = word_tf[word] / max_tf

            # Compute TF-IDF for each word and select the top N keywords
            tfidf_scores = {
                word: word_tf[word] * self.idf.get(word, 0) for word in words
            }
            top_keywords = sorted(tfidf_scores, key=tfidf_scores.get, reverse=True)[: self.top_n]

            # Build the processed document based on the selected keys
            processed_doc = {key: doc.get(key, "") for key in self.keys}
            processed_doc["keywords"] = top_keywords
            processed_documents.append(processed_doc)

        return processed_documents