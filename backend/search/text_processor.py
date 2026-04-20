"""
Text preprocessing utilities:
- Tokenization
- Stop-word removal
- Stemming (Porter Stemmer)
"""

import re
import math
from collections import defaultdict

# Minimal English stop words (no NLTK required)
STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "is", "was", "are", "were", "be", "been", "has", "have",
    "had", "do", "does", "did", "will", "would", "can", "could", "may",
    "might", "shall", "should", "it", "its", "this", "that", "these",
    "those", "i", "we", "you", "he", "she", "they", "my", "your", "our",
    "their", "from", "by", "as", "into", "through", "during", "before",
    "after", "above", "below", "between", "out", "off", "over", "under",
    "then", "once", "all", "any", "both", "each", "more", "most", "other",
    "some", "such", "no", "not", "only", "same", "so", "than", "too",
    "very", "just", "made", "make", "use", "used", "using",
}


def simple_stem(word: str) -> str:
    """
    Lightweight rule-based stemmer (suffix stripping).
    Handles the most common English suffixes without external libraries.
    """
    if len(word) <= 3:
        return word

    suffixes = [
        ("ational", "ate"), ("tional", "tion"), ("enci", "ence"),
        ("anci", "ance"), ("izer", "ize"), ("ising", "ise"),
        ("izing", "ize"), ("ised", "ise"), ("ized", "ize"),
        ("nesses", ""), ("fulness", ""), ("ousness", ""), ("iveness", ""),
        ("ational", ""), ("tional", ""), ("ations", ""), ("ation", ""),
        ("ators", ""), ("ator", ""),
        ("ings", ""), ("ing", ""), ("edly", ""), ("edly", ""),
        ("edly", ""), ("ness", ""), ("ment", ""), ("ments", ""),
        ("ities", ""), ("ity", ""), ("ives", ""), ("ive", ""),
        ("ables", ""), ("able", ""), ("ibles", ""), ("ible", ""),
        ("ance", ""), ("ence", ""),
        ("ies", "y"), ("ied", "y"),
        ("sses", "ss"), ("es", ""), ("s", ""),
    ]

    for suffix, replacement in suffixes:
        if word.endswith(suffix) and len(word) - len(suffix) >= 3:
            return word[: -len(suffix)] + replacement

    return word


def tokenize(text: str) -> list[str]:
    """Lowercase, remove punctuation, split into tokens."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return text.split()


def preprocess(text: str) -> list[str]:
    """Full pipeline: tokenize → remove stop words → stem."""
    tokens = tokenize(text)
    tokens = [t for t in tokens if t not in STOP_WORDS and len(t) > 1]
    tokens = [simple_stem(t) for t in tokens]
    return tokens


# ---------------------------------------------------------------------------
# Inverted Index
# ---------------------------------------------------------------------------

class InvertedIndex:
    """
    Builds an inverted index from a list of documents.
    Supports TF-IDF computation and cosine-similarity ranked retrieval.
    """

    def __init__(self):
        # term -> {doc_id: term_frequency}
        self.index: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
        self.doc_lengths: dict[str, int] = {}   # doc_id -> number of terms
        self.num_docs: int = 0
        self.doc_store: dict[str, dict] = {}    # doc_id -> original document

    def build(self, documents: list[dict]):
        """Index a list of recipe documents."""
        self.num_docs = len(documents)

        for doc in documents:
            doc_id = doc["id"]
            self.doc_store[doc_id] = doc

            # Combine title + description + ingredients for indexing
            combined = " ".join([
                doc.get("title", ""),
                doc.get("description", ""),
                " ".join(doc.get("ingredients", [])),
                doc.get("instructions", ""),
            ])
            terms = preprocess(combined)
            self.doc_lengths[doc_id] = len(terms)

            for term in terms:
                self.index[term][doc_id] += 1

    def tf(self, term: str, doc_id: str) -> float:
        """Term Frequency = count(term, doc) / total_terms(doc)."""
        count = self.index.get(term, {}).get(doc_id, 0)
        length = self.doc_lengths.get(doc_id, 1)
        return count / length if length else 0.0

    def idf(self, term: str) -> float:
        """Inverse Document Frequency = log(N / df(term))."""
        df = len(self.index.get(term, {}))
        if df == 0:
            return 0.0
        return math.log(self.num_docs / df)

    def tfidf(self, term: str, doc_id: str) -> float:
        return self.tf(term, doc_id) * self.idf(term)

    def search(self, query: str, top_k: int = 10) -> list[dict]:
        """
        Vector-space model search.
        Returns up to top_k documents sorted by cosine similarity to the query.
        """
        query_terms = preprocess(query)
        if not query_terms:
            return []

        # Compute query TF-IDF vector
        query_tf: dict[str, float] = defaultdict(float)
        for term in query_terms:
            query_tf[term] += 1
        for term in query_tf:
            query_tf[term] /= len(query_terms)

        query_vec: dict[str, float] = {
            term: query_tf[term] * self.idf(term) for term in query_tf
        }

        # Accumulate dot products for candidate documents
        scores: dict[str, float] = defaultdict(float)
        for term, q_weight in query_vec.items():
            for doc_id in self.index.get(term, {}):
                scores[doc_id] += q_weight * self.tfidf(term, doc_id)

        # Normalize by query vector magnitude (cosine similarity)
        query_mag = math.sqrt(sum(v ** 2 for v in query_vec.values()))
        if query_mag == 0:
            return []

        results = []
        for doc_id, score in scores.items():
            normalized_score = score / query_mag
            doc = self.doc_store[doc_id].copy()
            doc["score"] = round(normalized_score, 4)
            results.append(doc)

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]


# Module-level singleton index, built once at startup
_index: InvertedIndex | None = None


def get_index() -> InvertedIndex:
    global _index
    if _index is None:
        from data.recipes import RECIPES
        _index = InvertedIndex()
        _index.build(RECIPES)
    return _index
