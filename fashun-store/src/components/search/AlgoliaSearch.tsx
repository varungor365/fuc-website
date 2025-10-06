'use client';

import { useState, useEffect } from 'react';
import { APIIntegrations } from '@/lib/api-integrations';
import algoliasearch from 'algoliasearch/lite';

interface SearchResult {
  objectID: string;
  title: string;
  price: number;
  image: string;
}

export default function AlgoliaSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const config = APIIntegrations.getAlgoliaConfig();
        if (!config.appId || !config.apiKey) return;

        const client = algoliasearch(config.appId, config.apiKey);
        const index = client.initIndex(config.indexName);
        
        const { hits } = await index.search(query, {
          hitsPerPage: 10,
        });

        setResults(hits as SearchResult[]);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
      />

      {loading && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg p-4">
          <div className="animate-pulse">Searching...</div>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result) => (
            <a
              key={result.objectID}
              href={`/product/${result.objectID}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
            >
              <img
                src={result.image}
                alt={result.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{result.title}</h3>
                <p className="text-gray-600">${result.price}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
