export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  sourceName: string;
}

export interface SummarizeResponse {
  summary: string;
  keyPoints: string[];
  sentiment: string;
}

const API_BASE = import.meta.env.PROD 
  ? 'https://market-digest-backend.onrender.com/api'  // Use your backend URL in production
  : 'http://localhost:8080/api';  // Use localhost in development

export async function fetchCompanies(search = ''): Promise<string[]> {
  const res = await fetch(`${API_BASE}/companies?search=${encodeURIComponent(search)}`);
  if (!res.ok) throw new Error('Failed to fetch companies');
  return res.json();
}

export async function fetchNews(companies: string[]): Promise<Record<string, NewsArticle[]>> {
  const res = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companies }),
  });
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

export async function fetchSummary(company: string, articles: NewsArticle[]): Promise<SummarizeResponse> {
  const res = await fetch(`${API_BASE}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company, articles }),
  });
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
} 