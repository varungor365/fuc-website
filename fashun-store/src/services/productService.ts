import { supabase } from '@/lib/supabaseClient';

export class ProductService {
  // Get all products
  static async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }

    return data || [];
  }

  // Get featured products
  static async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      throw new Error(`Error fetching featured products: ${error.message}`);
    }

    return data || [];
  }

  // Get products by category
  static async getProductsByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }

    return data || [];
  }

  // Get single product by ID
  static async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw new Error(`Error fetching product: ${error.message}`);
    }

    return data;
  }

  // Search products
  static async searchProducts(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }

    return data || [];
  }

  // Get product categories
  static async getCategories() {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }

    // Extract unique categories
    const categories = Array.from(new Set(data?.map((item: any) => item.category).filter(Boolean)));
    return categories;
  }
}