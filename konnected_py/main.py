from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel

from systems.recommendation.external_handlers import generateModels

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    generateModels(forceBooks=True)
    pass
        
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"message": "Invalid request data"}
    )
    
@app.get("/")
async def root():
    return {"message": "Welcome to the Konnected System API"}

@app.get("/categories")
async def get_categories(key: str):
    import json
    with open('assets/data/books.json') as f:
        books = json.load(f)

    categories = []
    for book in books:
        for k in book.keys():
            if k == key:
                categories.append(book[k])

    # if first element is a list, flatten it
    if isinstance(categories[0], list):
        categories = [item for sublist in categories for item in sublist]
    
    categories = {i: categories.count(i) for i in categories}

    return categories

@app.get("/book_detail")
async def get_book_detail():
    import json
    with open('assets/data/books.json') as f:
        books = json.load(f)
    
    with open('assets/data/dataT.json') as f:
        dataT = json.load(f)

    for book in books:
        for data in dataT:
            if book['book_id'] == data['book_id']:
                book['audience_level'] = data['categories']
                book['subject'] = data['tags']

    # save the updated books
    with open('assets/data/books.json', 'w') as f:
        json.dump(books, f)

    return {"message": "Book details updated"}

from systems.recommendation.processor import preprocess_books, preprocess_notes
from systems.recommendation.external_handlers import checkLoadData
@app.get("/keywords")
async def get_keywords():
    books = checkLoadData("books")
    return preprocess_books(books)
    
from routes import details_routes, recommendation_routes, quiz_routes
app.include_router(recommendation_routes.router, prefix="/recommend", tags=["recommendationSystem"])
app.include_router(details_routes.router, prefix="/details", tags=["detailsSystem"])
app.include_router(quiz_routes.router, prefix="/quiz", tags=["quizSystem"])

import uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    run_main()

# cli uvicorn run
# uvicorn main:app --reload
