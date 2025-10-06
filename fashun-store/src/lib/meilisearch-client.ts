import { MeiliSearch } from 'meilisearch';

export const searchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY,
});

export const searchProducts = async (query: string, filters?: any) => {
  const index = searchClient.index('products');
  
  return await index.search(query, {
    limit: 20,
    attributesToHighlight: ['title', 'description'],
    attributesToCrop: ['description'],
    cropLength: 200,
    filter: filters,
    sort: ['price:asc'],
  });
};

export const indexProduct = async (product: any) => {
  const index = searchClient.index('products');
  await index.addDocuments([product]);
};

export const updateProductIndex = async (products: any[]) => {
  const index = searchClient.index('products');
  await index.updateDocuments(products);
};

export const deleteProductFromIndex = async (productId: string) => {
  const index = searchClient.index('products');
  await index.deleteDocument(productId);
};

export const configureMeilisearch = async () => {
  const index = searchClient.index('products');
  
  await index.updateSettings({
    searchableAttributes: ['title', 'description', 'tags', 'category'],
    filterableAttributes: ['price', 'category', 'tags', 'in_stock'],
    sortableAttributes: ['price', 'created_at'],
    displayedAttributes: ['id', 'title', 'description', 'price', 'thumbnail', 'category'],
  });
};
