# Konnected System API

## Overview

This application provides an API for the systems of Konnected App, such as: **Recommendation System** using *KNN*, **Contextual Summary and Explanation** using *RNN* and **Adaptive Quiz** using *IRT*. The API is built using FastAPI and is designed to be simple and easy to use. It provides endpoints for recommending notes and books based on a given note or book ID.

The application will be available at [http://localhost:8000](http://localhost:8000).

## API Endpoints

### 1. Recommend Notes

**Endpoint:** `GET /api/note`

**Description:** Recommends notes based on a given note ID.

**Query Parameters:**
- `note_id` (string): The ID of the note to base recommendations on. **(Required)**
- `limit` (integer, optional): The maximum number of recommendations to return. Default is 5.

**Response:**
- A JSON array of recommended notes, each containing the following fields:
  - `note_id`
  - `title`
  - `subtopic_id`
  - `relevance_score`
  - `connected_notes`
  - `subject`
  - `audience_level`

**Example Request:**
```
GET /api/note?note_id=8&limit=3
```

**Example Response:**
```json
[
    {
        "note_id": "7",
        "title": "Statistics Fundamentals",
        "relevance_score": 0.91,
        "connected_notes": ["2", "6"],
        "subject": ["Statistics"],
        "audience_level": ["BBA", "MBA"]
    },
    {
        "note_id": "6",
        "title": "Data Science Concepts",
        "relevance_score": 0.89,
        "connected_notes": ["3"],
        "subject": ["Data Science"],
        "audience_level": ["BSC"]
    }
]
```

---

### 2. Recommend Books

**Endpoint:** `GET /api/book`

**Description:** Recommends books based on a given book ID.

**Query Parameters:**
- `book_id` (string): The ID of the book to base recommendations on. **(Required)**
- `limit` (integer, optional): The maximum number of recommendations to return. Default is 5.

**Response:**
- A JSON array of recommended books, each containing the following fields:
  - `book_id`
  - `title`
  - `author`
  - `audience_level`
  - `topics`
  - `subtopics`
  - `subject`

**Example Request:**
```
GET /api/book?book_id=1&limit=3
```

**Example Response:**
```json
[
    {
        "book_id": "5",
        "title": "Introduction to Algebra 2",
        "author": "My Doe",
        "audience_level": ["BSC", "BBA"],
        "topics": ["Algebra"],
        "subtopics": ["Linear Equations"],
        "subject": ["Mathematics", "Science"]
    },
    {
        "book_id": "2",
        "title": "Advanced Calculus",
        "author": "Jane Smith",
        "audience_level": ["BSC", "BIT"],
        "topics": ["Calculus"],
        "subtopics": ["Definite Integrals"],
        "subject": ["Mathematics", "Physics"]
    }
]
```

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   or
   python3 main.py
   ```

4. **Access the API**
   Open your browser or use a tool like Postman to access the endpoints at [http://localhost:8000](http://localhost:8000).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various recommendation systems and FastAPI documentation.
