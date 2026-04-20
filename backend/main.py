"""
Smart Recipe Search Engine - Backend API
Entry point for the FastAPI application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import text_search, ingredient_search

app = FastAPI(
    title="Smart Recipe Search Engine API",
    description="Recipe search API using TF-IDF text retrieval, ingredient matching, and fuzzy typo correction",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text_search.router, prefix="/search", tags=["Text Search"])
app.include_router(ingredient_search.router, prefix="/search", tags=["Ingredient Search"])


@app.get("/")
def root():
    return {"message": "Smart Recipe Search Engine API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
