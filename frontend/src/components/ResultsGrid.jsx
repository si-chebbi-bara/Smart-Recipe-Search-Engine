import React from 'react'
import RecipeCard from './RecipeCard'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import styles from './ResultsGrid.module.css'

const MODE_LABELS = {
  text:        { icon: '⌕', label: 'Text Search' },
  ingredients: { icon: '🧺', label: 'Ingredient Match' },
  image:       { icon: '📷', label: 'Image Similarity' },
}

export default function ResultsGrid({ status, results, total, errorMsg, activeMode, onRecipeClick }) {
  if (status === 'loading') return <LoadingSpinner />
  if (status === 'error')   return <ErrorMessage message={errorMsg} />
  if (status === 'idle')    return null

  const modeInfo = MODE_LABELS[activeMode] || MODE_LABELS.text

  return (
    <section className={styles.section}>
      {/* Results header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.modeTag}>
            {modeInfo.icon} {modeInfo.label}
          </span>
          <h2 className={styles.count}>
            {total} recipe{total !== 1 ? 's' : ''} found
          </h2>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem} style={{ color: '#1a7a3c' }}>■ High match</span>
          <span className={styles.legendItem} style={{ color: '#8a6800' }}>■ Medium</span>
          <span className={styles.legendItem} style={{ color: '#a03a1a' }}>■ Low</span>
        </div>
      </div>

      {/* Empty state */}
      {results.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔍</span>
          <p>No recipes matched your query. Try different keywords or ingredients.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {results.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} onClick={onRecipeClick} />
          ))}
        </div>
      )}
    </section>
  )
}
