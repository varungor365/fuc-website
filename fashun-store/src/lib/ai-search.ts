// AI-Powered Search Service with Typo Tolerance and Fashion-Specific Intelligence
import Fuse, { FuseResult } from 'fuse.js';

interface SearchOptions {
  query: string;
  filters?: {
    category?: string[];
    priceRange?: [number, number];
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
  };
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'popularity' | 'newest';
  limit?: number;
}

class AISearchService {
  private fuseInstance: Fuse<any> | null = null;
  private products: any[] = [];
  private synonymMap: { [key: string]: string[] } = {};
  private fashionSlang: { [key: string]: string[] } = {};

  constructor() {
    this.initializeFashionSynonyms();
    this.initializeFashionSlang();
  }

  private initializeFashionSynonyms() {
    this.synonymMap = {
      // Color synonyms
      'black': ['noir', 'dark', 'charcoal', 'onyx', 'jet'],
      'white': ['ivory', 'cream', 'off-white', 'pearl', 'snow'],
      'blue': ['navy', 'cobalt', 'azure', 'cerulean', 'indigo'],
      'red': ['crimson', 'scarlet', 'cherry', 'burgundy', 'wine'],
      'green': ['olive', 'forest', 'emerald', 'sage', 'mint'],
      'grey': ['gray', 'silver', 'slate', 'graphite', 'steel'],
      'brown': ['tan', 'beige', 'camel', 'chocolate', 'coffee'],
      'yellow': ['gold', 'amber', 'honey', 'mustard', 'lemon'],
      'pink': ['rose', 'blush', 'salmon', 'coral', 'magenta'],
      'purple': ['violet', 'lavender', 'plum', 'amethyst', 'mauve'],

      // Style synonyms
      'hoodie': ['hoody', 'sweatshirt', 'pullover', 'jumper'],
      'tshirt': ['t-shirt', 'tee', 'top', 'shirt'],
      'jeans': ['denim', 'pants', 'trousers'],
      'sneakers': ['trainers', 'kicks', 'shoes', 'runners'],
      'jacket': ['coat', 'outerwear', 'blazer'],
      'dress': ['frock', 'gown', 'outfit'],
      'shorts': ['short pants', 'bermuda', 'cutoffs'],
      'skirt': ['mini', 'midi', 'maxi'],

      // Fit synonyms
      'oversized': ['baggy', 'loose', 'relaxed', 'big'],
      'fitted': ['tight', 'slim', 'snug', 'tailored'],
      'regular': ['normal', 'standard', 'classic'],
      'skinny': ['tight', 'slim-fit', 'narrow'],
      'straight': ['regular', 'classic-fit'],

      // Material synonyms
      'cotton': ['organic cotton', '100% cotton', 'pure cotton'],
      'polyester': ['poly', 'synthetic'],
      'denim': ['jean material', 'cotton twill'],
      'leather': ['genuine leather', 'real leather'],
      'wool': ['merino', 'cashmere', 'lambswool']
    };
  }

  private initializeFashionSlang() {
    this.fashionSlang = {
      // Gen Z fashion terms
      'fit': ['outfit', 'look', 'style', 'ensemble'],
      'drip': ['style', 'fashion', 'swag', 'look'],
      'fire': ['amazing', 'cool', 'awesome', 'dope'],
      'basic': ['simple', 'plain', 'minimal'],
      'extra': ['over the top', 'dramatic', 'bold'],
      'lowkey': ['subtle', 'minimal', 'understated'],
      'highkey': ['obvious', 'bold', 'statement'],
      'slay': ['look amazing', 'kill it', 'stunning'],
      'vibes': ['aesthetic', 'mood', 'style'],
      'aesthetic': ['style', 'vibe', 'look', 'theme'],

      // Fashion style terms
      'streetwear': ['urban', 'casual', 'hip-hop', 'skate'],
      'preppy': ['classic', 'clean', 'collegiate', 'traditional'],
      'boho': ['bohemian', 'hippie', 'free-spirited', 'earthy'],
      'grunge': ['alternative', 'edgy', 'rock', 'punk'],
      'minimalist': ['clean', 'simple', 'basic', 'neutral'],
      'maximalist': ['bold', 'colorful', 'busy', 'extra'],
      'vintage': ['retro', 'old-school', 'classic', 'throwback'],
      'indie': ['alternative', 'unique', 'artsy', 'creative']
    };
  }

  async initialize(products: any[]) {
    this.products = products;
    
    // Configure Fuse.js for fuzzy search
    const fuseOptions = {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'category', weight: 0.2 },
        { name: 'tags', weight: 0.1 },
        { name: 'colors', weight: 0.1 },
        { name: 'materials', weight: 0.1 }
      ],
      threshold: 0.3, // Lower = more strict
      distance: 100,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true
    };

    this.fuseInstance = new Fuse(this.enhanceProductsForSearch(products), fuseOptions);
  }

  private enhanceProductsForSearch(products: any[]) {
    return products.map(product => ({
      ...product,
      searchText: this.createSearchableText(product),
      synonyms: this.generateSynonyms(product),
      slangTerms: this.generateSlangTerms(product)
    }));
  }

  private createSearchableText(product: any): string {
    const parts = [
      product.name,
      product.description,
      product.category,
      ...(product.tags || []),
      ...(product.colors || []),
      ...(product.materials || []),
      ...(product.sizes || [])
    ];
    return parts.filter(Boolean).join(' ').toLowerCase();
  }

  private generateSynonyms(product: any): string[] {
    const synonyms: string[] = [];
    const text = this.createSearchableText(product);
    
    Object.entries(this.synonymMap).forEach(([key, values]) => {
      if (text.includes(key.toLowerCase())) {
        synonyms.push(...values);
      }
    });

    return synonyms;
  }

  private generateSlangTerms(product: any): string[] {
    const slangTerms: string[] = [];
    const text = this.createSearchableText(product);
    
    Object.entries(this.fashionSlang).forEach(([slang, meanings]) => {
      meanings.forEach(meaning => {
        if (text.includes(meaning.toLowerCase())) {
          slangTerms.push(slang);
        }
      });
    });

    return slangTerms;
  }

  async search(options: SearchOptions): Promise<{
    results: any[];
    suggestions: string[];
    totalCount: number;
    appliedFilters: any;
  }> {
    if (!this.fuseInstance) {
      throw new Error('Search service not initialized');
    }

    let { query, filters = {}, sort = 'relevance', limit = 20 } = options;

    // Enhance query with synonyms and slang
    const enhancedQuery = this.enhanceQuery(query);
    
    // Perform fuzzy search
    let searchResults = this.fuseInstance.search(enhancedQuery);

    // Apply filters
    if (Object.keys(filters).length > 0) {
      searchResults = this.applyFilters(searchResults, filters);
    }

    // Sort results
    const sortedResults = this.sortResults(searchResults, sort);

    // Generate search suggestions
    const suggestions = this.generateSuggestions(query, searchResults);

    return {
      results: sortedResults.slice(0, limit).map(result => result.item),
      suggestions,
      totalCount: sortedResults.length,
      appliedFilters: filters
    };
  }

  private enhanceQuery(query: string): string {
    const words = query.toLowerCase().split(' ');
    const enhancedWords: string[] = [];

    words.forEach(word => {
      enhancedWords.push(word);

      // Add synonyms
      if (this.synonymMap[word]) {
        enhancedWords.push(...this.synonymMap[word]);
      }

      // Add slang translations
      if (this.fashionSlang[word]) {
        enhancedWords.push(...this.fashionSlang[word]);
      }

      // Reverse slang lookup
      Object.entries(this.fashionSlang).forEach(([slang, meanings]) => {
        if (meanings.includes(word)) {
          enhancedWords.push(slang);
        }
      });
    });

    return enhancedWords.join(' ');
  }

  private applyFilters(results: FuseResult<any>[], filters: any): FuseResult<any>[] {
    return results.filter(result => {
      const product = result.item;

      // Category filter
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(product.category)) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (product.price < min || product.price > max) return false;
      }

      // Size filter
      if (filters.sizes && filters.sizes.length > 0) {
        const productSizes = product.variants?.map((v: any) => v.size) || [];
        if (!filters.sizes.some((size: string) => productSizes.includes(size))) return false;
      }

      // Color filter
      if (filters.colors && filters.colors.length > 0) {
        const productColors = product.variants?.map((v: any) => v.color) || [];
        if (!filters.colors.some((color: string) => productColors.includes(color))) return false;
      }

      // Stock filter
      if (filters.inStock !== undefined) {
        if (filters.inStock && !product.inStock) return false;
        if (!filters.inStock && product.inStock) return false;
      }

      return true;
    });
  }

  private sortResults(results: FuseResult<any>[], sort: string): FuseResult<any>[] {
    switch (sort) {
      case 'price_asc':
        return results.sort((a, b) => a.item.price - b.item.price);
      case 'price_desc':
        return results.sort((a, b) => b.item.price - a.item.price);
      case 'popularity':
        return results.sort((a, b) => (b.item.popularity || 0) - (a.item.popularity || 0));
      case 'newest':
        return results.sort((a, b) => 
          new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime()
        );
      case 'relevance':
      default:
        return results.sort((a, b) => (a.score || 1) - (b.score || 1));
    }
  }

  private generateSuggestions(query: string, results: FuseResult<any>[]): string[] {
    const suggestions: Set<string> = new Set();

    // Add popular searches if no results
    if (results.length === 0) {
      suggestions.add('oversized hoodie');
      suggestions.add('graphic tee');
      suggestions.add('denim jacket');
      suggestions.add('sneakers');
      suggestions.add('black jeans');
    }

    // Add category suggestions
    const categories = Array.from(new Set(results.map(r => r.item.category)));
    categories.slice(0, 3).forEach(cat => suggestions.add(cat));

    // Add brand suggestions
    const brands = Array.from(new Set(results.map(r => r.item.brand).filter(Boolean)));
    brands.slice(0, 2).forEach(brand => suggestions.add(brand));

    return Array.from(suggestions).slice(0, 5);
  }

  // Auto-complete functionality
  async getAutoCompleteSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const suggestions: Set<string> = new Set();
    const lowerQuery = query.toLowerCase();

    // Product name matches
    this.products.forEach(product => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.name);
      }
    });

    // Category matches
    const categories = ['hoodies', 'tshirts', 'jeans', 'sneakers', 'jackets', 'dresses'];
    categories.forEach(category => {
      if (category.includes(lowerQuery)) {
        suggestions.add(category);
      }
    });

    // Synonym matches
    Object.entries(this.synonymMap).forEach(([key, synonyms]) => {
      if (key.includes(lowerQuery)) {
        suggestions.add(key);
      }
      synonyms.forEach(synonym => {
        if (synonym.includes(lowerQuery)) {
          suggestions.add(synonym);
        }
      });
    });

    return Array.from(suggestions).slice(0, 8);
  }
}

export default AISearchService;