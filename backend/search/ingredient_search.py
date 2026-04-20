"""
Ingredient-based search:
- Normalizes ingredient queries
- Ranks recipes by Jaccard-style overlap score
"""

from search.text_processor import simple_stem, tokenize
from data.recipes import RECIPES


def normalize_ingredient(ing: str) -> str:
    """Lowercase, strip whitespace, stem the ingredient string."""
    tokens = tokenize(ing)
    return " ".join(simple_stem(t) for t in tokens if t)


def search_by_ingredients(query_ingredients: list[str], top_k: int = 10) -> list[dict]:
    """
    Rank recipes by the fraction of queried ingredients they contain.

    Score formula:
        overlap = |query ∩ recipe_ingredients|
        score   = overlap / |query ∪ recipe_ingredients|   (Jaccard similarity)
    """
    if not query_ingredients:
        return []

    # Normalize query ingredients
    norm_query = {normalize_ingredient(ing) for ing in query_ingredients if ing.strip()}

    results = []
    for recipe in RECIPES:
        norm_recipe = {normalize_ingredient(ing) for ing in recipe["ingredients"]}

        intersection = norm_query & norm_recipe
        union = norm_query | norm_recipe

        if not union:
            continue

        jaccard = len(intersection) / len(union)
        overlap_count = len(intersection)

        if overlap_count == 0:
            continue

        doc = recipe.copy()
        doc["score"] = round(jaccard, 4)
        doc["matched_ingredients"] = list(intersection)
        results.append(doc)

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]
