'use client';

import React, { useState, useEffect, useContext, createContext } from 'react';
import { DollarSign, TrendingUp, Globe, ChevronDown, Check } from 'lucide-react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Exchange rate relative to base currency (USD)
  locale: string; // For number formatting
  popular?: boolean;
}

export interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number, showCode?: boolean) => string;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Default currencies with mock exchange rates
const DEFAULT_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    rate: 1.0,
    locale: 'en-US',
    popular: true
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rate: 0.85,
    locale: 'de-DE',
    popular: true
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    rate: 0.73,
    locale: 'en-GB',
    popular: true
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    flag: '🇨🇦',
    rate: 1.35,
    locale: 'en-CA',
    popular: true
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    rate: 1.45,
    locale: 'en-AU'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    rate: 110.0,
    locale: 'ja-JP'
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    flag: '🇨🇭',
    rate: 0.92,
    locale: 'de-CH'
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    flag: '🇸🇪',
    rate: 8.5,
    locale: 'sv-SE'
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    flag: '🇳🇴',
    rate: 8.8,
    locale: 'nb-NO'
  },
  {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
    flag: '🇩🇰',
    rate: 6.3,
    locale: 'da-DK'
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    flag: '🇨🇳',
    rate: 6.4,
    locale: 'zh-CN'
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    rate: 74.5,
    locale: 'en-IN'
  }
];

interface CurrencyProviderProps {
  children: React.ReactNode;
  defaultCurrency?: string;
  apiKey?: string; // For real exchange rates
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  defaultCurrency = 'INR',
  apiKey
}) => {
  const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    DEFAULT_CURRENCIES.find(c => c.code === defaultCurrency) || DEFAULT_CURRENCIES[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load saved currency preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrencyCode = localStorage.getItem('selectedCurrency');
      if (savedCurrencyCode) {
        const savedCurrency = currencies.find(c => c.code === savedCurrencyCode);
        if (savedCurrency) {
          setSelectedCurrency(savedCurrency);
        }
      }
    }
  }, [currencies]);

  // Fetch exchange rates (mock implementation)
  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (!apiKey) return; // Use default rates if no API key

      setIsLoading(true);
      try {
        // Mock API call - replace with real exchange rate service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real implementation, you would fetch from:
        // https://api.exchangerate-api.com/v4/latest/USD
        // or similar service
        
        console.log('Exchange rates updated (mock)');
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
    
    // Update rates every hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, [apiKey]);

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCurrency', currency.code);
    }
  };

  const convertPrice = (amount: number, fromCurrency = 'USD'): number => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = selectedCurrency.rate;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const formatPrice = (amount: number, showCode = false): string => {
    const convertedAmount = convertPrice(amount);
    
    try {
      const formatted = new Intl.NumberFormat(selectedCurrency.locale, {
        style: 'currency',
        currency: selectedCurrency.code,
        minimumFractionDigits: selectedCurrency.code === 'JPY' ? 0 : 2
      }).format(convertedAmount);

      if (showCode && !formatted.includes(selectedCurrency.code)) {
        return `${formatted} ${selectedCurrency.code}`;
      }

      return formatted;
    } catch (error) {
      // Fallback formatting
      const symbol = selectedCurrency.symbol;
      return `${symbol}${convertedAmount.toFixed(selectedCurrency.code === 'JPY' ? 0 : 2)}`;
    }
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    currencies,
    setCurrency,
    formatPrice,
    convertPrice,
    isLoading
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

interface CurrencySelectorProps {
  className?: string;
  compact?: boolean;
  showPopularFirst?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  compact = false,
  showPopularFirst = true
}) => {
  const { selectedCurrency, currencies, setCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const sortedCurrencies = React.useMemo(() => {
    if (!showPopularFirst) return currencies;
    
    return [...currencies].sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [currencies, showPopularFirst]);

  const popularCurrencies = currencies.filter(c => c.popular);

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 
                   border border-white/20 rounded-lg transition-all duration-200 text-white"
        >
          <span className="text-lg">{selectedCurrency.flag}</span>
          <span className="font-medium">{selectedCurrency.symbol}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-primary-900/95 backdrop-blur-lg 
                        border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Select Currency</h3>
              
              {/* Popular Currencies */}
              {showPopularFirst && (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {popularCurrencies.map(currency => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setCurrency(currency);
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          selectedCurrency.code === currency.code
                            ? 'bg-accent-500/20 border border-accent-500/30 text-accent-300'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                        }`}
                      >
                        <span>{currency.flag}</span>
                        <span className="text-sm font-medium">{currency.code}</span>
                        {selectedCurrency.code === currency.code && (
                          <Check className="w-3 h-3 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-3 mb-3">
                    <span className="text-gray-400 text-xs font-medium">All Currencies</span>
                  </div>
                </>
              )}

              {/* All Currencies */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {sortedCurrencies.map(currency => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setCurrency(currency);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg 
                              transition-all duration-200 text-left ${
                      selectedCurrency.code === currency.code
                        ? 'bg-accent-500/20 border border-accent-500/30 text-accent-300'
                        : 'hover:bg-white/5 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{currency.flag}</span>
                      <div>
                        <div className="text-sm font-medium">{currency.code}</div>
                        <div className="text-xs text-gray-400">{currency.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{currency.symbol}</span>
                      {selectedCurrency.code === currency.code && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Exchange Rate Notice */}
            <div className="bg-white/5 border-t border-white/10 p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>
                  {isLoading ? 'Updating rates...' : 'Rates updated hourly'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // Full currency selector for settings/checkout
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent-500/20 rounded-lg border border-accent-500/30">
          <Globe className="w-5 h-5 text-accent-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Currency</h3>
          <p className="text-gray-400 text-sm">Choose your preferred currency</p>
        </div>
      </div>

      {/* Selected Currency Display */}
      <div className="bg-white/5 border border-white/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedCurrency.flag}</span>
            <div>
              <div className="text-white font-semibold">{selectedCurrency.name}</div>
              <div className="text-gray-400 text-sm">{selectedCurrency.code} • {selectedCurrency.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">1 USD = {selectedCurrency.rate} {selectedCurrency.code}</div>
            <div className="text-gray-400 text-sm">Exchange Rate</div>
          </div>
        </div>
      </div>

      {/* Popular Currencies */}
      {showPopularFirst && (
        <div>
          <h4 className="text-white font-medium text-sm mb-3">Popular Currencies</h4>
          <div className="grid grid-cols-2 gap-3">
            {popularCurrencies.map(currency => (
              <button
                key={currency.code}
                onClick={() => setCurrency(currency)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                  selectedCurrency.code === currency.code
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{currency.flag}</span>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{currency.code}</div>
                  <div className="text-gray-400 text-xs">{currency.symbol}</div>
                </div>
                {selectedCurrency.code === currency.code && (
                  <Check className="w-4 h-4 text-accent-400 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Currencies */}
      <div>
        <h4 className="text-white font-medium text-sm mb-3">All Currencies</h4>
        <div className="max-h-64 overflow-y-auto border border-white/20 rounded-lg">
          {sortedCurrencies.map((currency, index) => (
            <button
              key={currency.code}
              onClick={() => setCurrency(currency)}
              className={`w-full flex items-center justify-between p-3 hover:bg-white/5 
                        transition-colors border-b border-white/10 last:border-b-0 ${
                selectedCurrency.code === currency.code ? 'bg-accent-500/10' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{currency.flag}</span>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{currency.name}</div>
                  <div className="text-gray-400 text-xs">{currency.code} • Rate: {currency.rate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{currency.symbol}</span>
                {selectedCurrency.code === currency.code && (
                  <Check className="w-4 h-4 text-accent-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rate Update Notice */}
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <TrendingUp className="w-4 h-4" />
        <span>
          {isLoading ? 'Updating exchange rates...' : 'Exchange rates are updated every hour'}
        </span>
      </div>
    </div>
  );
};

// Price display component with currency conversion
interface PriceDisplayProps {
  amount: number;
  originalPrice?: number;
  fromCurrency?: string;
  showCode?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  originalPrice,
  fromCurrency,
  showCode = false,
  className = '',
  size = 'medium'
}) => {
  const { formatPrice } = useCurrency();

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-bold text-white ${sizeClasses[size]}`}>
        {formatPrice(amount, showCode)}
      </span>
      {originalPrice && originalPrice > amount && (
        <span className={`line-through text-gray-400 ${
          size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'
        }`}>
          {formatPrice(originalPrice, showCode)}
        </span>
      )}
    </div>
  );
};

export default CurrencySelector;