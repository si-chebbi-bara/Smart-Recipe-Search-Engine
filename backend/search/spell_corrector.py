"""
Fuzzy typo correction for text queries.

Builds a vocabulary from recipe titles + ingredients and uses fuzzy matching
to replace misspelled query tokens with the closest known vocabulary term.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

try:
    from rapidfuzz import fuzz, process
except Exception:  # pragma: no cover - fallback path when rapidfuzz is unavailable
    fuzz = None
    process = None


def _tokenize_words(text: str) -> list[str]:
    """Lowercase word tokenizer used for vocabulary and query correction."""
    return re.findall(r"[a-z0-9]+", text.lower())


def _levenshtein_distance(a: str, b: str) -> int:
    """Classic dynamic-programming Levenshtein edit distance."""
    if a == b:
        return 0
    if not a:
        return len(b)
    if not b:
        return len(a)

    prev_row = list(range(len(b) + 1))
    for i, ch_a in enumerate(a, start=1):
        current_row = [i]
        for j, ch_b in enumerate(b, start=1):
            insert_cost = current_row[j - 1] + 1
            delete_cost = prev_row[j] + 1
            replace_cost = prev_row[j - 1] + (0 if ch_a == ch_b else 1)
            current_row.append(min(insert_cost, delete_cost, replace_cost))
        prev_row = current_row

    return prev_row[-1]


def _levenshtein_similarity(a: str, b: str) -> float:
    """Return similarity percentage in the range [0, 100]."""
    max_len = max(len(a), len(b))
    if max_len == 0:
        return 100.0
    distance = _levenshtein_distance(a, b)
    return 100.0 * (1.0 - (distance / max_len))


@dataclass
class CorrectionResult:
    original_query: str
    corrected_query: str
    changed: bool


class SpellCorrector:
    def __init__(self, vocabulary: set[str], threshold: float = 80.0):
        self.vocabulary = sorted(vocabulary)
        self.vocabulary_set = set(self.vocabulary)
        self.threshold = threshold

    @classmethod
    def from_recipes(cls, recipes: list[dict], threshold: float = 80.0) -> "SpellCorrector":
        vocab: set[str] = set()

        for recipe in recipes:
            vocab.update(_tokenize_words(recipe.get("title", "")))
            for ingredient in recipe.get("ingredients", []):
                vocab.update(_tokenize_words(ingredient))

        return cls(vocabulary=vocab, threshold=threshold)

    def _correct_word(self, word: str) -> str:
        # Keep very short tokens unchanged to reduce noisy substitutions.
        if len(word) <= 2 or word in self.vocabulary_set:
            return word

        if process is not None and fuzz is not None:
            match = process.extractOne(
                word,
                self.vocabulary,
                scorer=fuzz.ratio,
                score_cutoff=self.threshold,
            )
            if match:
                return match[0]
            return word

        # Fallback: manual Levenshtein similarity search.
        best_word = word
        best_score = self.threshold
        for candidate in self.vocabulary:
            score = _levenshtein_similarity(word, candidate)
            if score > best_score:
                best_score = score
                best_word = candidate

        return best_word

    def correct_query(self, query: str) -> CorrectionResult:
        words = _tokenize_words(query)
        if not words:
            normalized = query.strip()
            return CorrectionResult(
                original_query=query,
                corrected_query=normalized,
                changed=False,
            )

        corrected_words = [self._correct_word(word) for word in words]
        corrected_query = " ".join(corrected_words)

        return CorrectionResult(
            original_query=query,
            corrected_query=corrected_query,
            changed=corrected_words != words,
        )


_spell_corrector: SpellCorrector | None = None


def get_spell_corrector() -> SpellCorrector:
    global _spell_corrector
    if _spell_corrector is None:
        from data.recipes import RECIPES
        _spell_corrector = SpellCorrector.from_recipes(RECIPES, threshold=80.0)
    return _spell_corrector
