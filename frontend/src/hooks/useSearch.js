/**
 * useSearch — centralises all search state and dispatches API calls.
 * Components only call the returned action functions; they never touch the API directly.
 */

import { useState, useCallback } from 'react'
import { searchByText, searchByIngredients, searchByImage } from '../services/api'

const IDLE    = 'idle'
const LOADING = 'loading'
const SUCCESS = 'success'
const ERROR   = 'error'

export default function useSearch() {
  const [status,      setStatus]      = useState(IDLE)
  const [results,     setResults]     = useState([])
  const [total,       setTotal]       = useState(0)
  const [errorMsg,    setErrorMsg]    = useState('')
  const [activeMode,  setActiveMode]  = useState('text') // 'text' | 'ingredients' | 'image'

  const _handleResponse = (data, mode) => {
    setResults(data.results ?? [])
    setTotal(data.total ?? 0)
    setStatus(SUCCESS)
    setActiveMode(mode)
  }

  const _handleError = (err) => {
    const msg =
      err?.response?.data?.detail ||
      err?.message ||
      'An unexpected error occurred.'
    setErrorMsg(msg)
    setStatus(ERROR)
    setResults([])
    setTotal(0)
  }

  const runTextSearch = useCallback(async (query) => {
    if (!query.trim()) return
    setStatus(LOADING)
    setErrorMsg('')
    try {
      const data = await searchByText(query)
      _handleResponse(data, 'text')
    } catch (err) {
      _handleError(err)
    }
  }, [])

  const runIngredientSearch = useCallback(async (ingredients) => {
    if (!ingredients.length) return
    setStatus(LOADING)
    setErrorMsg('')
    try {
      const data = await searchByIngredients(ingredients)
      _handleResponse(data, 'ingredients')
    } catch (err) {
      _handleError(err)
    }
  }, [])

  const runImageSearch = useCallback(async (file) => {
    if (!file) return
    setStatus(LOADING)
    setErrorMsg('')
    try {
      const data = await searchByImage(file)
      _handleResponse(data, 'image')
    } catch (err) {
      _handleError(err)
    }
  }, [])

  const reset = useCallback(() => {
    setStatus(IDLE)
    setResults([])
    setTotal(0)
    setErrorMsg('')
  }, [])

  return {
    status,
    results,
    total,
    errorMsg,
    activeMode,
    isLoading: status === LOADING,
    isSuccess: status === SUCCESS,
    isError:   status === ERROR,
    runTextSearch,
    runIngredientSearch,
    runImageSearch,
    reset,
  }
}
