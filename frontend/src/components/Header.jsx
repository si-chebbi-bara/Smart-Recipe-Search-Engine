import React from 'react'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>Récipe</span>
        </div>
        <nav className={styles.nav}>
          <span className={styles.tagline}>
            AI-powered culinary discovery
          </span>
        </nav>
      </div>
      <div className={styles.stripe} />
    </header>
  )
}
