import { useEffect, useState } from 'react';
import { fetchJson } from '../api.js';

export default function useBooks({ genre, search, page, limit }) {
  const [state, setState] = useState({
    books: [],
    pagination: { page: 1, limit, total: 0, totalPages: 0 },
    loading: true,
    error: '',
  });

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (genre) params.set('genre', genre);
    if (search.trim()) params.set('search', search.trim());

    setState((current) => ({ ...current, loading: true, error: '' }));
    fetchJson(`/books?${params.toString()}`, { signal: controller.signal })
      .then((result) => {
        if (!Array.isArray(result.data) || !result.pagination) {
          throw new Error('The catalog response is in an unexpected format.');
        }
        setState({
          books: result.data,
          pagination: result.pagination,
          loading: false,
          error: '',
        });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState((current) => ({
            ...current,
            books: [],
            loading: false,
            error: error.message || 'Unable to load books.',
          }));
        }
      });

    return () => controller.abort();
  }, [genre, search, page, limit]);

  return state;
}
