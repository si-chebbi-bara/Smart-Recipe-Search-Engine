"""
POST /search/image
Accepts an uploaded image file and returns CNN-similarity ranked results.
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from utils.models import SearchResponse, RecipeResult
from search.image_search import search_by_image

router = APIRouter()


@router.post("/image", response_model=SearchResponse)
async def image_search(
    file: UploadFile = File(...),
    top_k: int = Query(default=10, ge=1, le=50),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    raw_results = search_by_image(image_bytes, top_k=top_k)

    results = [RecipeResult(**r) for r in raw_results]
    return SearchResponse(
        query=f"image:{file.filename}",
        total=len(results),
        results=results,
    )
