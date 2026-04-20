import React from 'react'
import styles from './ErrorMessage.module.css'

export default function ErrorMessage({ message }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className={styles.title}>Search failed</p>
        <p className={styles.msg}>{message || 'Something went wrong. Is the backend running?'}</p>
      </div>
    </div>
  )
}
