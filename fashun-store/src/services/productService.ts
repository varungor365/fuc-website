import { supabase } from '@/lib/supabaseClient';

export class ProductService {
  // Get all products
  static async getAllProducts() {
    // Return empty array if Supabase is not configured (e.g., during build time)
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(`Error fetching products: ${error.message}`);
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn('Failed to fetch products:', error);
      return [];
    }
  }

  // Get featured products
  static async getFeaturedProducts() {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.warn(`Error fetching featured products: ${error.message}`);
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn('Failed to fetch featured products:', error);
      return [];
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string) {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(`Error fetching products by category: ${error.message}`);
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn('Failed to fetch products by category:', error);
      return [];
    }
  }

  // Get single product by ID
  static async getProductById(id: string) {
    if (!supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        console.warn(`Error fetching product: ${error.message}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to fetch product:', error);
      return null;
    }
  }

  // Search products
  static async searchProducts(query: string) {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(`Error searching products: ${error.message}`);
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn('Failed to search products:', error);
      return [];
    }
  }

  // Get product categories
  static async getCategories() {
    if (!supabase) {
      return ['Hoodies', 'T-Shirts', 'Polos']; // Default categories for fallback
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.warn(`Error fetching categories: ${error.message}`);
        return ['Hoodies', 'T-Shirts', 'Polos']; // Default categories
      }

      // Extract unique categories
      const categories = Array.from(new Set(data?.map((item: any) => item.category).filter(Boolean)));
      return categories.length > 0 ? categories : ['Hoodies', 'T-Shirts', 'Polos'];
    } catch (error) {
      console.warn('Failed to fetch categories:', error);
      return ['Hoodies', 'T-Shirts', 'Polos']; // Default categories
    }
  }
}