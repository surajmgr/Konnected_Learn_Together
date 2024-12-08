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
    # generateModels(forceBooks=False)
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
