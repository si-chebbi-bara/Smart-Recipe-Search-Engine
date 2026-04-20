import React, { useState } from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar({ onSearch, isLoading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrap}>
        <span className={styles.icon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder='Search recipes... e.g. "creamy pasta" or "healthy chicken"'
          disabled={isLoading}
          autoFocus
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => setValue('')}
            aria-label="Clear"
          >×</button>
        )}
      </div>
      <button className={styles.btn} type="submit" disabled={isLoading || !value.trim()}>
        {isLoading ? <span className={styles.spinner} /> : 'Search'}
      </button>
    </form>
  )
}
