from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from routes.details_routes import book_details, note_details

from systems.recommendation.external_handlers import generateModels, recommendNotes, recommendBooks, benchmark_recommendation_system

router = APIRouter()

class NoteRecommendationRequest(BaseModel):
    note_id: str
    limit: int = 5

@router.get("/note")
async def recommend_note(note_recommendation : NoteRecommendationRequest):
    try:
        recommendations = recommendNotes(note_recommendation.note_id, note_recommendation.limit)
        notes = await note_details(recommendations)
        return notes
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )

class BookRecommendationRequest(BaseModel):
    book_id: str
    limit: int = 5

@router.get("/book")
async def recommend_book(book_recommendation : BookRecommendationRequest):
    try:
        recommendations = recommendBooks(book_recommendation.book_id, book_recommendation.limit)
        return recommendations
        recommendations.extend([book_recommendation.book_id])
        books = await book_details(recommendations)
        currentBook = {}
        for book in books:
            if book["book_id"] == book_recommendation.book_id:
                currentBook = book
                books.remove(book)
                break

        return {f"The recommendations for {currentBook['book_id']} - {currentBook['title']} are" : [f"{book['book_id']}: {book['title']}" for book in books]}

    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )

@router.get("/benchmark")
async def benchmark_system(num_records: int):
    try:
        benchmark_recommendation_system(num_records)
        return {"message": "Benchmarking complete"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )