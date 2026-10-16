import { useEffect, useState } from 'react';
import { fetchNews } from '../lib/news.js';

// Fetches live articles; on failure (or no key) `articles` stays null
// so pages can fall back to their placeholder stories.
export default function useNews(query, deps = []) {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchNews(query)
      .then((data) => {
        if (cancelled) return;
        setArticles(data.length > 0 ? data : null);
      })
      .catch((err) => {
        if (cancelled) return;
        setArticles(null);
        setError(err.message);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, deps);

  return { articles, loading, error };
}
