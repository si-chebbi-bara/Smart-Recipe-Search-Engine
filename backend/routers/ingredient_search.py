"""
POST /search/ingredients
Accepts a list of ingredient strings and returns Jaccard-ranked results.
"""

from fastapi import APIRouter, HTTPException
from utils.models import IngredientSearchRequest, SearchResponse, RecipeResult
from search.ingredient_search import search_by_ingredients

router = APIRouter()


@router.post("/ingredients", response_model=SearchResponse)
def ingredient_search(body: IngredientSearchRequest):
    if not body.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list must not be empty.")

    raw_results = search_by_ingredients(body.ingredients, top_k=body.top_k)

    results = [RecipeResult(**r) for r in raw_results]
    return SearchResponse(
        query=", ".join(body.ingredients),
        total=len(results),
        results=results,
    )
