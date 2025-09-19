/**
 * Multi-Language Support Service
 * Provides comprehensive internationalization with dynamic content translation
 */

export interface LanguageConfig {
  code: string; // ISO 639-1 code (e.g., 'en', 'es', 'fr')
  name: string; // Display name (e.g., 'English', 'Español', 'Français')
  nativeName: string; // Native name (e.g., 'English', 'Español', 'Français')
  flag: string; // Flag emoji or URL
  rtl: boolean; // Right-to-left text direction
  currency: string; // Default currency code
  dateFormat: string; // Date format pattern
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: {
      symbol: string;
      position: 'before' | 'after';
    };
  };
}

export interface TranslationResource {
  [key: string]: string | TranslationResource;
}

export interface TranslationNamespace {
  [namespace: string]: TranslationResource;
}

export interface LocalizationContext {
  language: string;
  region?: string;
  currency: string;
  timezone: string;
  numberFormat: Intl.NumberFormatOptions;
  dateFormat: Intl.DateTimeFormatOptions;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
  domain?: 'fashion' | 'ecommerce' | 'general' | 'technical';
  quality?: 'standard' | 'professional' | 'creative';
}

export interface TranslationResult {
  translatedText: string;
  confidence: number;
  alternatives?: string[];
  detectedLanguage?: string;
  metadata: {
    provider: string;
    model?: string;
    processingTime: number;
    characterCount: number;
  };
}

export interface ContentTranslation {
  id: string;
  originalLanguage: string;
  translations: Record<string, {
    content: any;
    status: 'pending' | 'completed' | 'failed' | 'reviewing';
    lastUpdated: Date;
    translator?: string;
    quality: number;
  }>;
  metadata: {
    contentType: 'product' | 'page' | 'ui' | 'marketing';
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
  };
}

export interface LocaleData {
  language: LanguageConfig;
  translations: TranslationNamespace;
  contentTranslations: Record<string, ContentTranslation>;
  preferences: {
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    measurementUnit: 'metric' | 'imperial';
    priceDisplay: 'inclusive' | 'exclusive'; // tax inclusive/exclusive
  };
}

class MultiLanguageService {
  private supportedLanguages: Map<string, LanguageConfig> = new Map();
  private currentLanguage: string = 'en';
  private fallbackLanguage: string = 'en';
  private translations: Map<string, TranslationNamespace> = new Map();
  private baseUrl = '/api/i18n';
  private cache = new Map<string, any>();
  private translationProviders: string[] = ['google', 'deepl', 'azure', 'aws'];

  constructor(
    languages: LanguageConfig[],
    defaultLanguage: string = 'en',
    fallbackLanguage: string = 'en'
  ) {
    this.currentLanguage = defaultLanguage;
    this.fallbackLanguage = fallbackLanguage;
    
    // Initialize supported languages
    languages.forEach(lang => {
      this.supportedLanguages.set(lang.code, lang);
    });

    this.initializeLanguageDetection();
  }

  /**
   * Initialize automatic language detection
   */
  private initializeLanguageDetection(): void {
    if (typeof window === 'undefined') return;

    // Detect from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (urlLang && this.supportedLanguages.has(urlLang)) {
      this.setLanguage(urlLang);
      return;
    }

    // Detect from subdomain (e.g., es.example.com)
    const subdomain = window.location.hostname.split('.')[0];
    if (this.supportedLanguages.has(subdomain)) {
      this.setLanguage(subdomain);
      return;
    }

    // Detect from path (e.g., /es/products)
    const pathLang = window.location.pathname.split('/')[1];
    if (pathLang && this.supportedLanguages.has(pathLang)) {
      this.setLanguage(pathLang);
      return;
    }

    // Detect from localStorage
    const storedLang = localStorage.getItem('preferred-language');
    if (storedLang && this.supportedLanguages.has(storedLang)) {
      this.setLanguage(storedLang);
      return;
    }

    // Detect from browser preferences
    const browserLangs = navigator.languages || [navigator.language];
    for (const browserLang of browserLangs) {
      const lang = browserLang.split('-')[0]; // Extract language code
      if (this.supportedLanguages.has(lang)) {
        this.setLanguage(lang);
        return;
      }
    }
  }

  /**
   * Set current language
   */
  async setLanguage(languageCode: string, persist: boolean = true): Promise<void> {
    if (!this.supportedLanguages.has(languageCode)) {
      console.warn(`Language ${languageCode} not supported`);
      return;
    }

    this.currentLanguage = languageCode;

    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', languageCode);
    }

    // Load translations if not already loaded
    if (!this.translations.has(languageCode)) {
      await this.loadTranslations(languageCode);
    }

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = languageCode;
      
      // Update text direction for RTL languages
      const language = this.supportedLanguages.get(languageCode);
      if (language?.rtl) {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }

    // Emit language change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChange', { 
        detail: { language: languageCode } 
      }));
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(languageCode?: string): LanguageConfig | null {
    const lang = languageCode || this.currentLanguage;
    return this.supportedLanguages.get(lang) || null;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): LanguageConfig[] {
    return Array.from(this.supportedLanguages.values());
  }

  /**
   * Load translations for a language
   */
  async loadTranslations(languageCode: string): Promise<void> {
    try {
      const cacheKey = `translations-${languageCode}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        this.translations.set(languageCode, this.cache.get(cacheKey));
        return;
      }

      const response = await fetch(`${this.baseUrl}/translations/${languageCode}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${languageCode}`);
      }

      const translations = await response.json();
      this.translations.set(languageCode, translations);
      this.cache.set(cacheKey, translations);

    } catch (error) {
      console.error(`Failed to load translations for ${languageCode}:`, error);
      
      // Fall back to default language if available
      if (languageCode !== this.fallbackLanguage && this.translations.has(this.fallbackLanguage)) {
        console.warn(`Using fallback language ${this.fallbackLanguage}`);
      }
    }
  }

  /**
   * Translate a key with interpolation support
   */
  translate(
    key: string,
    variables?: Record<string, string | number>,
    languageCode?: string,
    namespace: string = 'common'
  ): string {
    const lang = languageCode || this.currentLanguage;
    
    // Get translations for language
    let translations = this.translations.get(lang);
    
    // Fallback to default language
    if (!translations) {
      translations = this.translations.get(this.fallbackLanguage);
    }

    if (!translations) {
      console.warn(`No translations available for key: ${key}`);
      return key;
    }

    // Navigate through nested translation object
    const keys = `${namespace}.${key}`.split('.');
    let translation: any = translations;
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        console.warn(`Translation key not found: ${key} in namespace ${namespace}`);
        return key;
      }
    }

    if (typeof translation !== 'string') {
      console.warn(`Translation is not a string: ${key}`);
      return key;
    }

    // Interpolate variables
    if (variables) {
      return this.interpolateVariables(translation, variables);
    }

    return translation;
  }

  /**
   * Translate content with AI translation services
   */
  async translateContent(request: TranslationRequest): Promise<TranslationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Content translation failed:', error);
      
      return {
        translatedText: request.text,
        confidence: 0,
        metadata: {
          provider: 'fallback',
          processingTime: 0,
          characterCount: request.text.length
        }
      };
    }
  }

  /**
   * Translate product content
   */
  async translateProduct(
    productId: string,
    targetLanguages: string[],
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<Record<string, TranslationResult>> {
    try {
      const response = await fetch(`${this.baseUrl}/translate-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          targetLanguages,
          priority
        })
      });

      if (!response.ok) {
        throw new Error(`Product translation failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Product translation failed:', error);
      return {};
    }
  }

  /**
   * Format currency for current locale
   */
  formatCurrency(
    amount: number,
    currencyCode?: string,
    languageCode?: string
  ): string {
    const lang = languageCode || this.currentLanguage;
    const language = this.supportedLanguages.get(lang);
    const currency = currencyCode || language?.currency || 'USD';

    try {
      return new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting failed:', error);
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  /**
   * Format date for current locale
   */
  formatDate(
    date: Date,
    options?: Intl.DateTimeFormatOptions,
    languageCode?: string
  ): string {
    const lang = languageCode || this.currentLanguage;
    const language = this.supportedLanguages.get(lang);

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    try {
      return new Intl.DateTimeFormat(lang, options || defaultOptions).format(date);
    } catch (error) {
      console.error('Date formatting failed:', error);
      return date.toLocaleDateString();
    }
  }

  /**
   * Format number for current locale
   */
  formatNumber(
    number: number,
    options?: Intl.NumberFormatOptions,
    languageCode?: string
  ): string {
    const lang = languageCode || this.currentLanguage;

    try {
      return new Intl.NumberFormat(lang, options).format(number);
    } catch (error) {
      console.error('Number formatting failed:', error);
      return number.toString();
    }
  }

  /**
   * Get localized URL for current language
   */
  getLocalizedUrl(path: string, languageCode?: string): string {
    const lang = languageCode || this.currentLanguage;
    
    if (lang === this.fallbackLanguage) {
      return path;
    }

    return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /**
   * Get alternate language URLs for SEO
   */
  getAlternateUrls(path: string): Record<string, string> {
    const alternates: Record<string, string> = {};
    
    this.supportedLanguages.forEach((_, code) => {
      alternates[code] = this.getLocalizedUrl(path, code);
    });

    return alternates;
  }

  /**
   * Detect text language
   */
  async detectLanguage(text: string): Promise<{
    language: string;
    confidence: number;
    alternatives: Array<{ language: string; confidence: number }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/detect-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Language detection failed:', error);
      
      return {
        language: this.fallbackLanguage,
        confidence: 0,
        alternatives: []
      };
    }
  }

  /**
   * Get content translation status
   */
  async getTranslationStatus(contentId: string): Promise<ContentTranslation | null> {
    try {
      const response = await fetch(`${this.baseUrl}/translation-status/${contentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get translation status: ${response.statusText}`);
      }
      
      return await response.json();

    } catch (error) {
      console.error('Failed to get translation status:', error);
      return null;
    }
  }

  /**
   * Batch translate multiple keys
   */
  translateBatch(
    keys: string[],
    variables?: Record<string, Record<string, string | number>>,
    languageCode?: string,
    namespace: string = 'common'
  ): Record<string, string> {
    const results: Record<string, string> = {};
    
    keys.forEach(key => {
      const keyVariables = variables?.[key];
      results[key] = this.translate(key, keyVariables, languageCode, namespace);
    });

    return results;
  }

  /**
   * Get pluralized translation
   */
  translatePlural(
    key: string,
    count: number,
    variables?: Record<string, string | number>,
    languageCode?: string,
    namespace: string = 'common'
  ): string {
    const lang = languageCode || this.currentLanguage;
    const pluralKey = this.getPluralKey(key, count, lang);
    
    const mergedVariables = {
      count,
      ...variables
    };

    return this.translate(pluralKey, mergedVariables, languageCode, namespace);
  }

  /**
   * Generate language switcher data
   */
  getLanguageSwitcherData(): Array<{
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    active: boolean;
    url: string;
  }> {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    return Array.from(this.supportedLanguages.values()).map(lang => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag,
      active: lang.code === this.currentLanguage,
      url: this.getLocalizedUrl(currentPath, lang.code)
    }));
  }

  /**
   * Preload translations for multiple languages
   */
  async preloadTranslations(languageCodes: string[]): Promise<void> {
    const promises = languageCodes
      .filter(code => !this.translations.has(code))
      .map(code => this.loadTranslations(code));

    await Promise.all(promises);
  }

  /**
   * Get localization context for current language
   */
  getLocalizationContext(): LocalizationContext {
    const language = this.getLanguageConfig();
    
    return {
      language: this.currentLanguage,
      currency: language?.currency || 'USD',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      numberFormat: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      },
      dateFormat: {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    };
  }

  /**
   * Private helper methods
   */
  private interpolateVariables(text: string, variables: Record<string, string | number>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  }

  private getPluralKey(key: string, count: number, language: string): string {
    // Simple plural rules - in production, use proper i18n library like react-i18next
    const pluralRules = new Intl.PluralRules(language);
    const rule = pluralRules.select(count);
    
    switch (rule) {
      case 'zero':
        return `${key}.zero`;
      case 'one':
        return `${key}.one`;
      case 'two':
        return `${key}.two`;
      case 'few':
        return `${key}.few`;
      case 'many':
        return `${key}.many`;
      default:
        return `${key}.other`;
    }
  }

  /**
   * Export translations for external tools
   */
  async exportTranslations(
    format: 'json' | 'csv' | 'xliff' | 'po',
    languageCode?: string
  ): Promise<string> {
    try {
      const lang = languageCode || this.currentLanguage;
      const response = await fetch(`${this.baseUrl}/export/${lang}?format=${format}`);
      
      if (!response.ok) {
        throw new Error(`Translation export failed: ${response.statusText}`);
      }
      
      return await response.text();

    } catch (error) {
      console.error('Translation export failed:', error);
      return '';
    }
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get translation completion percentage
   */
  async getTranslationCompleteness(languageCode?: string): Promise<{
    percentage: number;
    totalKeys: number;
    translatedKeys: number;
    missingKeys: string[];
  }> {
    try {
      const lang = languageCode || this.currentLanguage;
      const response = await fetch(`${this.baseUrl}/completeness/${lang}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get translation completeness: ${response.statusText}`);
      }
      
      return await response.json();

    } catch (error) {
      console.error('Failed to get translation completeness:', error);
      return {
        percentage: 0,
        totalKeys: 0,
        translatedKeys: 0,
        missingKeys: []
      };
    }
  }
}

export default MultiLanguageService;