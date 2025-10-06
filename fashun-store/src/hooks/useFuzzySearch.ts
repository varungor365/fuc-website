import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export const useFuzzySearch = (items: any[], keys: string[]) => {
  const [query, setQuery] = useState('');

  const fuse = useMemo(
    () => new Fuse(items, {
      keys,
      threshold: 0.3,
      includeScore: true,
    }),
    [items, keys]
  );

  const results = useMemo(() => {
    if (!query) return items;
    return fuse.search(query).map(result => result.item);
  }, [query, fuse, items]);

  return { query, setQuery, results };
};
