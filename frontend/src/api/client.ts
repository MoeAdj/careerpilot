const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// This helper keeps all API calls in one place.
// It also automatically sends the login token when the user has one.
export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('careerpilot_token');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
