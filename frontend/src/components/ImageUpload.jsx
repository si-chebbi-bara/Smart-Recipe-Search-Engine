import React, { useState, useRef, useCallback } from 'react'
import styles from './ImageUpload.module.css'

export default function ImageUpload({ onSearch, isLoading }) {
  const [preview, setPreview] = useState(null)
  const [file,    setFile]    = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }, [])

  const handleChange = e => handleFile(e.target.files?.[0])

  const handleDrop = e => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (file) onSearch(file)
  }

  const clearFile = () => { setFile(null); setPreview(null) }

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${preview ? styles.hasPreview : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleChange}
          disabled={isLoading}
        />

        {preview ? (
          <div className={styles.previewWrap}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <button
              type="button"
              className={styles.clearBtn}
              onClick={e => { e.stopPropagation(); clearFile() }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Remove
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.uploadIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p className={styles.label}>
              {dragging ? 'Drop your image here' : 'Drag & drop a food image'}
            </p>
            <p className={styles.sub}>or <span className={styles.link}>browse files</span> · JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      <button
        className={styles.btn}
        type="submit"
        disabled={isLoading || !file}
      >
        {isLoading
          ? <><span className={styles.spinner} /> Searching…</>
          : <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              Find Similar Recipes
            </>
        }
      </button>
    </form>
  )
}
