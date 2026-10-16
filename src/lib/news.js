import { DEFAULT_IMAGE } from '../data/categories.js';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export function formatTimeAgo(dateString) {
  if (!dateString) return 'Recently';
  const publishedDate = new Date(dateString);
  const diffInMinutes = Math.floor((Date.now() - publishedDate) / 60000);

  if (isNaN(diffInMinutes) || diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const hours = Math.floor(diffInMinutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}

export async function fetchNews({ category, q }, pageSize = 15) {
  if (!API_KEY) throw new Error('Missing VITE_NEWS_API_KEY');

  const url = q
    ? `${BASE_URL}/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${API_KEY}`
    : `${BASE_URL}/top-headlines?country=in&category=${category}&pageSize=${pageSize}&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`NewsAPI error: ${response.status}`);

  const data = await response.json();
  if (data.status !== 'ok' || !Array.isArray(data.articles)) {
    throw new Error(data.message || 'NewsAPI returned no articles');
  }

  return data.articles
    .filter((a) => a.title && a.title !== '[Removed]')
    .map((a) => ({
      title: a.title,
      url: a.url,
      image: a.urlToImage || DEFAULT_IMAGE,
      source: (a.source?.name || 'NEWS').toUpperCase(),
      time: formatTimeAgo(a.publishedAt),
      excerpt: a.description || '',
    }));
}
