import axios from 'axios';

// ─────────────────────────────────────────────────────────────────
//  API BASE URL
//  • Android Emulator  → 'http://10.0.2.2:8000'
//  • Real phone (Expo) → change to your laptop's LAN IP
//                        Run `ipconfig` on Windows, look for IPv4
//                        e.g.  'http://192.168.1.5:8000'
// ─────────────────────────────────────────────────────────────────
export const BASE_URL = 'https://curly-heads-attack.loca.lt';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,   // 2 min — AI pipeline can be slow
  headers: {
    'Bypass-Tunnel-Reminder': 'true',
    'User-Agent': 'CropAI-Mobile'
  }
});

// ─── Core: Analyze a crop image ──────────────────────────────────
export async function analyzeCrop({ imageUri, lat, lon, treatmentType, userQuery, language }) {
  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'leaf.jpg',
  });
  formData.append('lat',            String(lat ?? 28.6139));
  formData.append('lon',            String(lon ?? 77.2090));
  formData.append('treatment_type', treatmentType ?? 'organic');
  formData.append('user_query',     userQuery ?? '');
  formData.append('language',       language ?? 'english');

  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// ─── Farm History ─────────────────────────────────────────────────
export async function getFarmHistory(leafId) {
  const response = await api.get(`/farm-history/${leafId}`);
  return response.data;
}

export async function createFarmRecord(leafId, data) {
  const response = await api.post(`/farm-history/${leafId}`, data);
  return response.data;
}

export async function deleteFarmRecord(leafId, index) {
  const response = await api.delete(`/farm-history/${leafId}/${index}`);
  return response.data;
}

// ─── Health check ─────────────────────────────────────────────────
export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

// ─── Build full URL for static assets (heatmaps, audio) ──────────
export function staticUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/^\//, '')}`;
}

export default api;
