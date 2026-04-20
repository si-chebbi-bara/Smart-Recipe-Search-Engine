# Smart Recipe Search Engine

A full-stack Information Retrieval project that helps users find recipes using text queries and ingredient lists, with fuzzy typo correction.

## Project Structure

- frontend/
- backend/
- README.md

## Project Overview

Users often remember only partial recipe names or available ingredients, and they may type with spelling mistakes. This system solves that by combining:

- Text retrieval with TF-IDF and cosine similarity
- Ingredient overlap ranking with Jaccard similarity
- Fuzzy query correction for typo-tolerant search

## What Was Implemented

### Frontend (React)

- Home page with two search modes:
  - Text search input
  - Tag-style ingredient input
- Results rendered as recipe cards with:
  - Title
  - Ingredient preview
  - Similarity score
- Clickable recipe cards that open a detail modal (no page navigation)
  - Full title
  - Full ingredients
  - Instructions
- UX states:
  - Loading spinner
  - Error message handling
- Frontend contains no ranking logic; it only calls backend APIs.

### Backend (FastAPI)

- POST /search/text
- POST /search/ingredients

Backend IR pipeline includes:

- Text preprocessing (tokenization, stop-word removal, stemming)
- Inverted index
- TF-IDF weighting
- Cosine similarity ranking
- Ingredient matching with overlap ranking (Jaccard)
- Fuzzy typo correction (RapidFuzz with Levenshtein fallback)

## Search Algorithms

### 1. Text Search

1. Tokenize query and documents
2. Remove stop words
3. Apply stemming
4. Compute TF-IDF vectors
5. Rank with cosine similarity

### 2. Ingredient Search

1. Normalize ingredient text
2. Compute overlap between query ingredients and recipe ingredients
3. Rank by Jaccard score

### 3. Fuzzy Search (Typo Correction)

Before text ranking, query tokens are compared against a vocabulary built from recipe titles and ingredients.

- Example: chikcen pastaa -> chicken pasta
- If similarity score is above threshold (for example 80), token is corrected
- Otherwise original token is preserved

The backend can return both original and corrected query fields for transparency.

## How It Works

Pipeline:

Input -> Preprocessing -> Matching -> Ranking -> JSON Output

- Text query:
  - Input -> Fuzzy correction -> TF-IDF + cosine -> Ranked recipes
- Ingredient query:
  - Input -> Ingredient normalization -> Jaccard overlap -> Ranked recipes

## API Reference

### POST /search/text

Request:

```json
{ "query": "chikcen pastaa", "top_k": 10 }
```

Response (example):

```json
{
  "query": "chikcen pastaa",
  "original_query": "chikcen pastaa",
  "corrected_query": "chicken pasta",
  "total": 3,
  "results": [
    {
      "id": "2",
      "title": "Chicken Tikka Masala",
      "description": "...",
      "ingredients": ["chicken breast", "..."],
      "image_url": "https://...",
      "tags": ["Indian", "chicken"],
      "score": 0.41,
      "matched_ingredients": null
    }
  ]
}
```

### POST /search/ingredients

Request:

```json
{ "ingredients": ["eggs", "cheese", "tomatoes"], "top_k": 10 }
```

## Technologies Used

- Frontend: React, Vite, Axios, CSS Modules
- Backend: Python, FastAPI, Pydantic, Uvicorn
- IR: Inverted Index, TF-IDF, Cosine Similarity, Jaccard Similarity
- Fuzzy Matching: RapidFuzz (primary), Levenshtein distance fallback

## How to Run

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend URL: http://localhost:8000
Docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:3000

## Presentation Explanation

### Problem

Users struggle to find recipes when they only know partial text, available ingredients, or make typos.

### Solution

A smart search system that combines:

- Text retrieval (TF-IDF + cosine)
- Ingredient filtering/ranking (Jaccard overlap)
- Typo correction (fuzzy matching)

### What Was Done

1. Designed frontend UI
2. Built backend API
3. Implemented inverted indexing
4. Implemented ranking models
5. Added fuzzy typo correction
6. Connected frontend and backend

## Teacher Questions - Suggested Answers

### Basic Concepts

- What is an inverted index?
  - A mapping from term -> documents containing that term, enabling fast retrieval.

- What is TF-IDF?
  - A weighting scheme where TF measures term importance in a document and IDF penalizes common terms across documents.

- What is cosine similarity?
  - A measure of angle between vectors to estimate semantic similarity regardless of vector length.

### Architecture

- Why separate frontend and backend?
  - Separation of concerns, easier testing, independent scaling, and cleaner maintenance.

- How do they communicate?
  - Frontend sends HTTP requests to backend REST endpoints and receives JSON responses.

### IR Concepts

- Why not simple keyword matching?
  - Keyword matching is binary; vector ranking gives graded relevance and better partial matches.

- Boolean vs vector model?
  - Boolean model returns exact match/no-match; vector model ranks by relevance score.

### Fuzzy Search

- How do you handle typos?
  - Compare query tokens with known vocabulary and replace only high-confidence matches.

- What is Levenshtein distance?
  - Minimum edit operations (insert, delete, substitute) needed to transform one string into another.

### Evaluation

- What is precision?
  - Fraction of retrieved results that are relevant.

- What is recall?
  - Fraction of all relevant items that the system successfully retrieves.

### Critical Discussion

- Limitations:
  - Small static dataset, English-only preprocessing, limited personalization.

- Improvements:
  - Larger dataset, query expansion/synonyms, learning-to-rank, feedback loop, offline evaluation metrics.

## Tunisian Food Update

We improved the system to support local Tunisian dishes.

### New Recipes Added

- Couscous
- Lablabi
- Ojja with Merguez
- Brik with Tuna and Egg

Each new recipe includes:

- Name
- Ingredients
- Instructions

### Search Support

- Text search now finds Tunisian recipes by name.
- Ingredient search now works with Tunisian ingredients like harissa and chickpeas.
- Typo correction also supports local words, for example:
  - couscouss -> couscous

### UI Update

- Tunisian recipes are shown in cards.
- Cards include a "Tunisian Food" label.
- Optional filter added: "Show only Tunisian recipes".

### Why This Matters

- The system is more useful for Tunisian users.
- It shows that search systems can adapt to local culture and language.

### Teacher Questions (Tunisian Feature)

- Why did you add Tunisian food?
  - To make the app useful for local users and local dishes.

- How did you update the dataset?
  - We added new Tunisian recipes with full ingredients and instructions in the backend dataset.

- Does the search work the same way?
  - Yes. The same TF-IDF, ingredient ranking, and fuzzy correction pipeline is used.

- What challenges did you face with local words?
  - Some local spellings can vary. We solved this with fuzzy matching and a recipe vocabulary that includes Tunisian terms.
