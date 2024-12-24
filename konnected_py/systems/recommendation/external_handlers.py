# Script for all external handling and processing of data

from systems.recommendation.recommendation_system import RecommendationSystem
from systems.recommendation.processor import preprocess_books, preprocess_notes
from systems.recommendation.dummy_generator import gen_save_notes, gen_save_books
import os, json, time

_notes_recommendations = None
_books_recommendations = None

books_path = "assets/data/books.json"
notes_path = "assets/data/notes.json"

def notesInstance():
    notes_recommendations = RecommendationSystem(
        k=10,
        metric="euclidean",
        vectorize_attrs=["subtopic_id", "keywords", "connected_notes", "relevance_score", "subject", "audience_level"],
        keys={"id": "note_id", "keywords": "keywords", "model_name": "note"}
    )
    return notes_recommendations

def booksInstance():
    books_recommendations = RecommendationSystem(
        k=10,
        metric="euclidean",
        vectorize_attrs=["keywords", "audience_level", "subject"],
        keys={"id": "book_id", "keywords": "keywords", "model_name": "book"}
    )
    return books_recommendations

def checkLoadData(cat="books"):
    if cat == "books":
        if not os.path.exists(books_path):
            gen_save_books()

        with open(books_path, "r") as f:
            books = json.load(f)

        return books

    elif cat == "notes":
        if not os.path.exists(notes_path):
            gen_save_notes()
            
        with open(notes_path, "r") as f:
            notes = json.load(f)

        return notes

def generateModels(force=False, forceBooks=False, forceNotes=False):
    if not os.path.exists(books_path) or force or forceBooks:
        books = checkLoadData("books")
        books_dataset = preprocess_books(books)
        books_recommendations = booksInstance()
        books_recommendations.train_model(books_dataset)

    if not os.path.exists(notes_path) or force or forceNotes:
        notes = checkLoadData("notes")
        notes_dataset = preprocess_notes(notes)
        notes_recommendations = notesInstance()
        notes_recommendations.train_model(notes_dataset)

def benchmark_recommendation_system(num_records):
    """Benchmark the recommendation system with synthetic data."""
    print(f"Benchmarking with {num_records} records...")

    # Create a RecommendationSystem instance for books
    books_recommendations = booksInstance()
    books_recommendations.benchmark(num_records)
    
    # Create a RecommendationSystem instance for notes
    notes_recommendations = notesInstance()
    notes_recommendations.benchmark(num_records)
        
def recommendNotes(note_id, limit=5):
    global _notes_recommendations
    if _notes_recommendations is None:
        _notes_recommendations = notesInstance()
        _notes_recommendations.load_model()
    recommendations = _notes_recommendations.recommend(note_id, limit)
    return recommendations

def recommendBooks(book_id, limit=5):
    global _books_recommendations
    if _books_recommendations is None:
        _books_recommendations = booksInstance()
        _books_recommendations.load_model()
    recommendations = _books_recommendations.recommend(book_id, limit)
    return recommendations