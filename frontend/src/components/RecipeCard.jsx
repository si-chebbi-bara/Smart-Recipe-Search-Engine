import React, { useState } from 'react'
import styles from './RecipeCard.module.css'

const SCORE_COLORS = {
  high:   { bg: '#edfaf1', text: '#1a7a3c', border: '#a3d9b5' },
  medium: { bg: '#fef8ec', text: '#8a6800', border: '#f0d580' },
  low:    { bg: '#fdf0ec', text: '#a03a1a', border: '#f0b8a0' },
}

function scoreLevel(score) {
  if (score >= 0.3) return 'high'
  if (score >= 0.1) return 'medium'
  return 'low'
}

function ScoreBadge({ score }) {
  const level = scoreLevel(score)
  const c = SCORE_COLORS[level]
  const pct = Math.round(score * 100)
  return (
    <span
      className={styles.scoreBadge}
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {pct}% match
    </span>
  )
}

export default function RecipeCard({ recipe, index, onClick }) {
  const [imgError, setImgError] = useState(false)

  const handleKeyDown = (e) => {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(recipe)
    }
  }

  return (
    <article
      className={`${styles.card} ${onClick ? styles.cardInteractive : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={onClick ? () => onClick(recipe) : undefined}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View details for ${recipe.title}` : undefined}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {!imgError ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className={styles.image}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.imageFallback}>
            <span>🍽️</span>
          </div>
        )}
        <ScoreBadge score={recipe.score} />
        {recipe.tags?.length > 0 && (
          <span className={styles.primaryTag}>{recipe.tags[0]}</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.desc}>{recipe.description}</p>

        {/* Ingredients preview */}
        <div className={styles.ingredientsSection}>
          <span className={styles.ingLabel}>Ingredients</span>
          <div className={styles.ingredientsList}>
            {recipe.ingredients.slice(0, 5).map(ing => (
              <span
                key={ing}
                className={`${styles.ing} ${recipe.matched_ingredients?.includes(ing) ? styles.ingMatched : ''}`}
              >
                {ing}
              </span>
            ))}
            {recipe.ingredients.length > 5 && (
              <span className={styles.ingMore}>+{recipe.ingredients.length - 5} more</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {recipe.tags?.length > 1 && (
          <div className={styles.tags}>
            {recipe.tags.slice(1).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        {onClick && (
          <span className={styles.viewHint} aria-hidden="true">Tap for full recipe</span>
        )}
      </div>
    </article>
  )
}
