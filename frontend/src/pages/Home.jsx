import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import IngredientInput from '../components/IngredientInput'
import ResultsGrid from '../components/ResultsGrid'
import RecipeDetailModal from '../components/RecipeDetailModal'
import useSearch from '../hooks/useSearch'
import styles from './Home.module.css'

const TABS = [
  {
    id: 'text',
    label: 'Text Search',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    desc: 'Search by recipe name or description',
  },
  {
    id: 'ingredients',
    label: 'Ingredients',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v4H3z"/><path d="M5 7v13h14V7"/>
        <path d="M9 11h6M9 15h4"/>
      </svg>
    ),
    desc: 'Find recipes by what\'s in your fridge',
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('text')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    status, results, total, errorMsg, activeMode,
    isLoading,
    runTextSearch, runIngredientSearch,
  } = useSearch()

  useEffect(() => {
    if (!isModalOpen || !selectedRecipe) return
    const stillVisible = results.some((recipe) => recipe.id === selectedRecipe.id)
    if (!stillVisible) {
      setIsModalOpen(false)
      setSelectedRecipe(null)
    }
  }, [results, isModalOpen, selectedRecipe])

  const openRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe)
    setIsModalOpen(true)
  }

  const closeRecipeDetails = () => {
    setIsModalOpen(false)
  }

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroDecor} aria-hidden="true">
          <span>✦</span><span>◆</span><span>✦</span>
        </div>
        <h1 className={styles.heroTitle}>
          Discover Your<br />
          <em>Perfect Recipe</em>
        </h1>
        <p className={styles.heroSub}>
          AI-powered search combining text retrieval, ingredient matching,
          and visual similarity — all in one place.
        </p>
      </section>

      {/* Search Panel */}
      <section className={styles.panel}>
        {/* Tab Bar */}
        <div className={styles.tabBar}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab description */}
        <p className={styles.tabDesc}>
          {TABS.find(t => t.id === activeTab)?.desc}
        </p>

        {/* Active search UI */}
        <div className={styles.searchArea}>
          {activeTab === 'text' && (
            <SearchBar onSearch={runTextSearch} isLoading={isLoading} />
          )}
          {activeTab === 'ingredients' && (
            <IngredientInput onSearch={runIngredientSearch} isLoading={isLoading} />
          )}
        </div>
      </section>

      {/* Results */}
      <section className={styles.results}>
        <ResultsGrid
          status={status}
          results={results}
          total={total}
          errorMsg={errorMsg}
          activeMode={activeMode}
          onRecipeClick={openRecipeDetails}
        />
      </section>

      <RecipeDetailModal
        isOpen={isModalOpen}
        recipe={selectedRecipe}
        onClose={closeRecipeDetails}
      />

      {/* Info strip */}
      {status === 'idle' && (
        <section className={styles.infoStrip}>
          {[
            { icon: '📑', title: 'TF-IDF Ranking', body: 'Term Frequency–Inverse Document Frequency weights rare, informative terms higher than common ones.' },
            { icon: '🔍', title: 'Inverted Index', body: 'Each term maps to all recipes that contain it — enabling sub-millisecond lookups across the corpus.' },
            { icon: '🖼️', title: 'CNN Visual Search', body: 'MobileNetV2 extracts 1280-dimensional feature embeddings; cosine similarity finds visually alike dishes.' },
          ].map(card => (
            <div key={card.title} className={styles.infoCard}>
              <span className={styles.infoIcon}>{card.icon}</span>
              <h3 className={styles.infoTitle}>{card.title}</h3>
              <p className={styles.infoBody}>{card.body}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
