import { useState, useEffect } from 'react';
import { MedusaProductService } from '@/services/medusa';

export const useMedusaProducts = (params: any = {}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [JSON.stringify(params)]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { products, count } = await MedusaProductService.getProducts(params);
      setProducts(products);
      setCount(count || 0);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, count, refresh: loadProducts };
};

export const useMedusaProduct = (id: string) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await MedusaProductService.getProduct(id);
      setProduct(product);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, refresh: loadProduct };
};
