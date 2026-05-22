import axios from 'axios'

const BASE = 'http://localhost:8000'

export async function analyzeCrop({ image, lat, lon, treatmentType, userQuery, language }) {
  const form = new FormData()
  form.append('image', image)
  form.append('lat', lat)
  form.append('lon', lon)
  form.append('treatment_type', treatmentType)
  form.append('user_query', userQuery || '')
  form.append('language', language || 'english')
  const { data } = await axios.post(`${BASE}/analyze`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export function audioUrl(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `${BASE}${path}`
}

export async function deleteFarmMemory(leafId) {
  const { data } = await axios.delete(`${BASE}/farm-history/${leafId}`)
  return data
}
