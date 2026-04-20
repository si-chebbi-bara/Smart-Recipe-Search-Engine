import React, { useState, useRef } from 'react'
import styles from './IngredientInput.module.css'

export default function IngredientInput({ onSearch, isLoading }) {
  const [tags, setTags]       = useState([])
  const [inputVal, setInput]  = useState('')
  const inputRef              = useRef()

  const addTag = (raw) => {
    const trimmed = raw.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag))

  const handleKeyDown = (e) => {
    if (['Enter', ',', 'Tab'].includes(e.key)) {
      e.preventDefault()
      if (inputVal.trim()) addTag(inputVal)
    } else if (e.key === 'Backspace' && !inputVal && tags.length) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputVal.trim()) addTag(inputVal)
    if (tags.length || inputVal.trim()) {
      const finalTags = inputVal.trim()
        ? [...tags, inputVal.trim().toLowerCase()]
        : tags
      onSearch(finalTags)
    }
  }

  const SUGGESTIONS = ['chicken', 'garlic', 'tomatoes', 'pasta', 'eggs', 'cheese', 'onion']

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <div
        className={styles.tagBox}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button
              type="button"
              className={styles.tagRemove}
              onClick={e => { e.stopPropagation(); removeTag(tag) }}
              aria-label={`Remove ${tag}`}
            >×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.tagInput}
          value={inputVal}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length ? '' : 'Add ingredients… press Enter or comma to add'}
          disabled={isLoading}
        />
      </div>

      {/* Quick suggestions */}
      <div className={styles.suggestions}>
        <span className={styles.suggestLabel}>Quick add:</span>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            type="button"
            className={`${styles.chip} ${tags.includes(s) ? styles.chipActive : ''}`}
            onClick={() => tags.includes(s) ? removeTag(s) : addTag(s)}
          >{s}</button>
        ))}
      </div>

      <button
        className={styles.btn}
        type="submit"
        disabled={isLoading || (tags.length === 0 && !inputVal.trim())}
      >
        {isLoading
          ? <span className={styles.spinner} />
          : <>Find Recipes ({tags.length || (inputVal.trim() ? 1 : 0)} ingredient{tags.length !== 1 ? 's' : ''})</>
        }
      </button>
    </form>
  )
}
