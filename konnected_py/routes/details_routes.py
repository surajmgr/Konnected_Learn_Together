from fastapi import APIRouter
from fastapi.responses import JSONResponse

from systems.recommendation.external_handlers import checkLoadData

router = APIRouter()

@router.post("/books")
async def book_details(book_ids: list):
    try:
        books = checkLoadData("books")
        book_details = [book for book in books if book["book_id"] in book_ids]
        return book_details
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )

@router.post("/notes")
async def note_details(note_ids: list):
    try:
        notes = checkLoadData("notes")
        note_details = [note for note in notes if note["note_id"] in note_ids]
        return note_details
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )