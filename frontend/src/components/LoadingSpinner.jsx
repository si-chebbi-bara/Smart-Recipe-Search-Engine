import React from 'react'
import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner() {
  return (
    <div className={styles.wrap}>
      <div className={styles.ring}>
        <div /><div /><div /><div />
      </div>
      <p className={styles.text}>Searching recipes…</p>
    </div>
  )
}
