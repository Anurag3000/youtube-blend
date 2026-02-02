const API_BASE = "http://localhost:5000";

export function apiFetch(path, options = {}) {
  const token = localStorage.getItem("jwt");

  return fetch(API_BASE + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}
