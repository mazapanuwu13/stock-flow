const BASE_URL = '/api';

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) {
    const message = typeof json.error === 'string' ? json.error : 'API error';
    throw new Error(message);
  }
  return json.data as T;
}

export const apiClient = {
  get: <T>(path: string) => fetchJson<T>(path),
  post: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => fetchJson<T>(path, { method: 'DELETE' }),
};
