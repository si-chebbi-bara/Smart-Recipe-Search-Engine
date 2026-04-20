/**
 * api.js — All backend communication lives here.
 * The frontend components never contain fetch/axios logic directly.
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
})

/**
 * POST /search/text
 * @param {string} query
 * @param {number} topK
 */
export async function searchByText(query, topK = 10) {
  const { data } = await client.post('/search/text', { query, top_k: topK })
  return data
}

/**
 * POST /search/ingredients
 * @param {string[]} ingredients
 * @param {number} topK
 */
export async function searchByIngredients(ingredients, topK = 10) {
  const { data } = await client.post('/search/ingredients', {
    ingredients,
    top_k: topK,
  })
  return data
}

/**
 * POST /search/image
 * @param {File} file
 * @param {number} topK
 */
export async function searchByImage(file, topK = 10) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post(`/search/image?top_k=${topK}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
