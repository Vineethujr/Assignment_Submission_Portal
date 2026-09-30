import { auth } from '../firebase';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function apiFetch(path, options = {}) {
  if (!API_BASE_URL) throw new Error('REST API is not configured. Set VITE_API_BASE_URL to use the API service.');
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || data.error || `API request failed: ${response.status}`);
  return data;
}
