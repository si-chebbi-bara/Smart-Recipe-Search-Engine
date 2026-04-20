"""
POST /search/text
Accepts a text query and returns TF-IDF ranked recipe results.
"""

from fastapi import APIRouter, HTTPException
from utils.models import TextSearchRequest, SearchResponse, RecipeResult
from search.text_processor import get_index
from search.spell_corrector import get_spell_corrector

router = APIRouter()


@router.post("/text", response_model=SearchResponse)
def text_search(body: TextSearchRequest):
    if not body.query.strip():
        raise HTTPException(status_code=400, detail="Query must not be empty.")

    correction = get_spell_corrector().correct_query(body.query)

    index = get_index()
    raw_results = index.search(correction.corrected_query, top_k=body.top_k)

    results = [RecipeResult(**r) for r in raw_results]
    return SearchResponse(
        query=body.query,
        original_query=body.query,
        corrected_query=correction.corrected_query if correction.changed else None,
        total=len(results),
        results=results,
    )
