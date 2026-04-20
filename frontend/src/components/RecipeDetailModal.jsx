import React, { useEffect } from 'react'
import styles from './RecipeDetailModal.module.css'

function formatScore(score) {
  if (typeof score !== 'number') return null
  return `${Math.round(score * 100)}%`
}

export default function RecipeDetailModal({ isOpen, recipe, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen || !recipe) return null

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="recipe-modal-title">
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close recipe details">
          X
        </button>

        <div className={styles.mediaWrap}>
          <img src={recipe.image_url} alt={recipe.title} className={styles.image} />
        </div>

        <div className={styles.content}>
          {recipe.tags?.includes('Tunisian Food') && (
            <span className={styles.tunisianLabel}>Tunisian Food</span>
          )}
          <h2 id="recipe-modal-title" className={styles.title}>{recipe.title}</h2>
          <p className={styles.description}>{recipe.description}</p>

          <div className={styles.metaRow}>
            {formatScore(recipe.score) && <span className={styles.metaChip}>Similarity: {formatScore(recipe.score)}</span>}
            {recipe.difficulty && <span className={styles.metaChip}>Difficulty: {recipe.difficulty}</span>}
            {recipe.cooking_time && <span className={styles.metaChip}>Time: {recipe.cooking_time}</span>}
          </div>

          <section className={styles.section}>
            <h3>Ingredients</h3>
            <ul className={styles.list}>
              {(recipe.ingredients || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Instructions</h3>
            <p className={styles.instructions}>
              {recipe.instructions || 'Instructions are not available for this recipe in the current dataset.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
