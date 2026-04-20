"""
Shared Pydantic models for API request/response validation.
"""

from typing import Optional
from pydantic import BaseModel


class RecipeResult(BaseModel):
    id: str
    title: str
    description: str
    ingredients: list[str]
    image_url: str
    tags: list[str]
    score: float
    matched_ingredients: Optional[list[str]] = None


class SearchResponse(BaseModel):
    query: str
    original_query: Optional[str] = None
    corrected_query: Optional[str] = None
    total: int
    results: list[RecipeResult]


class TextSearchRequest(BaseModel):
    query: str
    top_k: int = 10


class IngredientSearchRequest(BaseModel):
    ingredients: list[str]
    top_k: int = 10
