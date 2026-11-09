import { useEffect, useState } from 'react';
import { fetchJson } from '../api.js';

export default function useGenres() {
  const [state, setState] = useState({ genres: [], loading: true, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    fetchJson('/genres', { signal: controller.signal })
      .then((genres) => {
        if (!Array.isArray(genres)) {
          throw new Error('The genre response is in an unexpected format.');
        }
        setState({ genres, loading: false, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ genres: [], loading: false, error: error.message || 'Unable to load genres.' });
        }
      });

    return () => controller.abort();
  }, []);

  return state;
}
