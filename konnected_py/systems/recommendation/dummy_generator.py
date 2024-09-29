import random
import json

subjects = ["Math", "Science", "History", "Literature", "Art", "Geography", "Physics", "Chemistry", "Biology", "Economics", "Computer Science", "Engineering", "Business"]
audience_levels = ["BSC", "CSIT", "BBA", "MBA", "BIT", "BCA"]

def generate_random_words(word_count):
    words = [
        "education", "learning", "knowledge", "student", "teacher", "classroom", "lesson", "chapter",
        "assignment", "course", "subject", "topic", "quiz", "exam", "study", "review", "discussion",
        "example", "illustration", "exercise", "problem", "solution", "concept", "idea", "theory",
        "practice", "application", "understanding", "comprehension", "explanation"
    ]
    return ' '.join(random.choices(words, k=word_count))

def choose_random_items(items):
    num_items = random.randint(1, min(3, len(items)))  # Randomly determine the number of items
    return random.sample(items, num_items)     # Return the selected items


def generate_dummy_notes(num_subtopics=5, notes_per_subtopic=10):
    dummy_notes = []
    
    for subtopic_id in range(1, num_subtopics + 1):
        for note_id in range(1, notes_per_subtopic + 1):
            note = {
                "note_id": f"note_{subtopic_id}_{note_id}",
                "subtopic_id": f"subtopic_{subtopic_id}",
                "title": generate_random_words(random.randint(5,10)),
                "note_text": generate_random_words(50),  # Random note text of 50 words
                "examples_illustrations": generate_random_words(15),  # Random examples/illustrations text of 30 words
                "connected_notes": [f"note_{subtopic_id}_{random.randint(1, notes_per_subtopic)}"
                                    for _ in range(random.randint(0, 3))],  # Randomly connected notes
                "relevance_score": round(random.uniform(0.5, 1.0), 2),  # Random relevance score between 0.5 and 1.0
                "subject": choose_random_items(subjects),  # Random subject from the list
                "audience_level": choose_random_items(audience_levels)  # Random audience level from the list
            }
            dummy_notes.append(note)

    return dummy_notes

def generate_dummy_books(num_books=10):
    dummy_books = []
    
    for book_id in range(1, num_books + 1):
        book = {
            "book_id": str(book_id),
            "title": generate_random_words(random.randint(2, 5)),
            "author": generate_random_words(2),
            "topics": [generate_random_words(random.randint(1, 2)) for _ in range(random.randint(1, 3))],
            "subtopics": [generate_random_words(random.randint(1, 2)) for _ in range(random.randint(1, 3))],
            "description": generate_random_words(30),
            "subject": choose_random_items(subjects),
            "audience_level": choose_random_items(audience_levels)
        }
        dummy_books.append(book)

    return dummy_books

# generate and save
def gen_save_notes(num_subtopics=5, notes_per_subtopic=10):
    notes = generate_dummy_notes(num_subtopics, notes_per_subtopic)
    with open('assets/data/notes.json', 'w') as f:
        json.dump(notes, f)

def gen_save_books(num_books=10):
    books = generate_dummy_books(num_books)
    with open('assets/data/books.json', 'w') as f:
        json.dump(books, f)