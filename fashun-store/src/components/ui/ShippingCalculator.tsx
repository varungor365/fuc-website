'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Truck, MapPin, Clock, Package, Calculator, Check, X, Loader2, AlertCircle } from 'lucide-react';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  cutoffTime?: string; // e.g., "2:00 PM"
  features: string[];
  icon: 'standard' | 'express' | 'overnight' | 'pickup';
  available: boolean;
  popular?: boolean;
}

interface ShippingRate {
  zone: string;
  options: ShippingOption[];
}

interface Address {
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

interface ShippingCalculatorProps {
  cartWeight?: number;
  cartValue?: number;
  origin?: Address;
  onShippingSelect?: (option: ShippingOption) => void;
  selectedShippingId?: string;
  className?: string;
  showEstimatedDelivery?: boolean;
  freeShippingThreshold?: number;
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  cartWeight = 0,
  cartValue = 0,
  origin,
  onShippingSelect,
  selectedShippingId,
  className = '',
  showEstimatedDelivery = true,
  freeShippingThreshold = 100
}) => {
  const [address, setAddress] = useState<Partial<Address>>({
    country: 'US',
    state: '',
    city: '',
    zipCode: ''
  });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  // Mock shipping rates database
  const shippingRates: Record<string, ShippingRate> = {
    'US-domestic': {
      zone: 'US Domestic',
      options: [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Reliable delivery within business days',
          price: 8.99,
          estimatedDays: { min: 5, max: 7 },
          features: ['Tracking included', 'Signature on delivery'],
          icon: 'standard',
          available: true
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Faster delivery for urgent orders',
          price: 15.99,
          estimatedDays: { min: 2, max: 3 },
          cutoffTime: '2:00 PM',
          features: ['Priority handling', 'Tracking included', 'Insurance included'],
          icon: 'express',
          available: true,
          popular: true
        },
        {
          id: 'overnight',
          name: 'Overnight Express',
          description: 'Next business day delivery',
          price: 24.99,
          estimatedDays: { min: 1, max: 1 },
          cutoffTime: '12:00 PM',
          features: ['Next day delivery', 'Signature required', 'Full insurance'],
          icon: 'overnight',
          available: true
        },
        {
          id: 'pickup',
          name: 'Store Pickup',
          description: 'Pick up from our store location',
          price: 0,
          estimatedDays: { min: 1, max: 2 },
          features: ['No shipping cost', 'Flexible pickup hours'],
          icon: 'pickup',
          available: true
        }
      ]
    },
    'international': {
      zone: 'International',
      options: [
        {
          id: 'intl-standard',
          name: 'International Standard',
          description: 'Economical international shipping',
          price: 25.99,
          estimatedDays: { min: 10, max: 21 },
          features: ['Customs handling', 'Basic tracking'],
          icon: 'standard',
          available: true
        },
        {
          id: 'intl-express',
          name: 'International Express',
          description: 'Fast international delivery',
          price: 49.99,
          estimatedDays: { min: 3, max: 7 },
          features: ['Priority customs', 'Full tracking', 'Insurance included'],
          icon: 'express',
          available: true
        }
      ]
    }
  };

  const validateAddress = useCallback(() => {
    if (!address.country) return false;
    if (address.country === 'US' && (!address.state || !address.zipCode)) return false;
    return true;
  }, [address]);

  const calculateShipping = useCallback(async () => {
    if (!validateAddress()) {
      setError('Please enter a valid address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Determine shipping zone
      const isInternational = address.country !== 'US';
      const rateKey = isInternational ? 'international' : 'US-domestic';
      const rates = shippingRates[rateKey];

      if (!rates) {
        throw new Error('Shipping not available to this location');
      }

      // Apply business logic
      let options = [...rates.options];

      // Apply free shipping if threshold is met
      if (cartValue >= freeShippingThreshold && !isInternational) {
        options = options.map(option => ({
          ...option,
          price: option.id === 'standard' ? 0 : option.price
        }));
      }

      // Adjust prices based on weight (mock logic)
      if (cartWeight > 5) {
        options = options.map(option => ({
          ...option,
          price: option.price + Math.floor((cartWeight - 5) * 1.5)
        }));
      }

      // Check availability based on address
      const restrictedZipCodes = ['99999', '00000'];
      if (address.zipCode && restrictedZipCodes.includes(address.zipCode)) {
        options = options.map(option => ({
          ...option,
          available: option.id === 'standard'
        }));
      }

      setShippingOptions(options);
      setCalculated(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate shipping');
    } finally {
      setLoading(false);
    }
  }, [address, cartWeight, cartValue, freeShippingThreshold, validateAddress]);

  const getShippingIcon = (iconType: ShippingOption['icon']) => {
    switch (iconType) {
      case 'standard':
        return <Truck className="w-5 h-5" />;
      case 'express':
        return <Truck className="w-5 h-5 text-accent-400" />;
      case 'overnight':
        return <Package className="w-5 h-5 text-purple-400" />;
      case 'pickup':
        return <MapPin className="w-5 h-5 text-blue-400" />;
    }
  };

  const formatDeliveryTime = (option: ShippingOption) => {
    const { min, max } = option.estimatedDays;
    if (min === max) {
      return `${min} business day${min > 1 ? 's' : ''}`;
    }
    return `${min}-${max} business days`;
  };

  const getEstimatedDeliveryDate = (option: ShippingOption) => {
    if (!showEstimatedDelivery) return null;

    const now = new Date();
    const businessDays = option.estimatedDays.max;
    let deliveryDate = new Date(now);
    
    // Add business days (excluding weekends)
    let addedDays = 0;
    while (addedDays < businessDays) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        addedDays++;
      }
    }

    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' }
  ];

  const usStates = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <Calculator className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Shipping Calculator</h3>
          <p className="text-gray-400 text-sm">Calculate shipping costs to your location</p>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {cartValue < freeShippingThreshold && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-300">
            <Truck className="w-4 h-4" />
            <span className="text-sm font-medium">
              Add ${(freeShippingThreshold - cartValue).toFixed(2)} more for FREE standard shipping!
            </span>
          </div>
        </div>
      )}

      {/* Address Form */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h4 className="text-white font-medium mb-4">Shipping Address</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <select
              value={address.country}
              onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value, state: '', city: '', zipCode: '' }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {address.country === 'US' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              <select
                value={address.state}
                onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="">Select State</option>
                {usStates.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {address.country === 'US' ? 'ZIP Code' : 'Postal Code'}
            </label>
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => setAddress(prev => ({ ...prev, zipCode: e.target.value }))}
              placeholder={address.country === 'US' ? '12345' : 'Enter postal code'}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Enter city"
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-accent-500"
            />
          </div>
        </div>

        <button
          onClick={calculateShipping}
          disabled={loading || !validateAddress()}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 
                   bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 
                   disabled:cursor-not-allowed text-white rounded-lg 
                   transition-all duration-200 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Calculate Shipping
            </>
          )}
        </button>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Shipping Options */}
      {calculated && shippingOptions.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-medium mb-4">Available Shipping Options</h4>
          
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <div
                key={option.id}
                className={`
                  relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                  ${option.available 
                    ? selectedShippingId === option.id
                      ? 'border-accent-500 bg-accent-500/10'
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    : 'border-gray-600 bg-gray-600/10 cursor-not-allowed opacity-50'
                  }
                  ${option.popular ? 'ring-2 ring-yellow-400/30' : ''}
                `}
                onClick={() => option.available && onShippingSelect?.(option)}
              >
                {option.popular && (
                  <div className="absolute -top-2 left-4 px-2 py-0.5 bg-yellow-500 
                                text-black text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                      {getShippingIcon(option.icon)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-white font-semibold">{option.name}</h5>
                        {selectedShippingId === option.id && (
                          <Check className="w-4 h-4 text-accent-400" />
                        )}
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-2">{option.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-300">
                          <Clock className="w-3 h-3" />
                          {formatDeliveryTime(option)}
                        </div>
                        
                        {getEstimatedDeliveryDate(option) && (
                          <div className="text-accent-400 font-medium">
                            By {getEstimatedDeliveryDate(option)}
                          </div>
                        )}
                        
                        {option.cutoffTime && (
                          <div className="text-yellow-400 text-xs">
                            Order by {option.cutoffTime}
                          </div>
                        )}
                      </div>
                      
                      {option.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {option.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-white/5 text-gray-300 text-xs 
                                       rounded-full border border-white/10"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">
                      {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                    </div>
                    {!option.available && (
                      <div className="text-red-400 text-xs font-medium mt-1">
                        Not Available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {calculated && shippingOptions.length === 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
          <X className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h4 className="text-white font-medium mb-2">Shipping Not Available</h4>
          <p className="text-gray-400 text-sm">
            We don't currently ship to this location. Please try a different address.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;