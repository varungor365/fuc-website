'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, Calculator, AlertCircle } from 'lucide-react';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}

interface ShippingCalculatorProps {
  productPrice: number;
  productWeight?: number;
  onShippingSelect: (option: ShippingOption, cost: number) => void;
  className?: string;
}

export default function ShippingCalculator({
  productPrice,
  productWeight = 0.5,
  onShippingSelect,
  className = ''
}: ShippingCalculatorProps) {
  const [pincode, setPincode] = useState('');
  const [isValidPincode, setIsValidPincode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Simulate shipping calculation
  const calculateShipping = async (pincode: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock shipping options based on pincode patterns
      const baseOptions: ShippingOption[] = [
        {
          id: 'standard',
          name: 'Standard Delivery',
          description: 'Free shipping on orders above ₹999',
          price: productPrice >= 999 ? 0 : 99,
          estimatedDays: '5-7 days',
          icon: 'package'
        },
        {
          id: 'express',
          name: 'Express Delivery',
          description: 'Faster delivery for urgent orders',
          price: 199,
          estimatedDays: '2-3 days',
          icon: 'truck'
        },
        {
          id: 'same-day',
          name: 'Same Day Delivery',
          description: 'Available in select cities',
          price: 299,
          estimatedDays: 'Today',
          icon: 'mappin'
        }
      ];

      // Adjust options based on location (mock logic)
      let availableOptions = [...baseOptions];
      
      // Mumbai, Delhi, Bangalore metro areas get same-day delivery
      if (['400', '110', '560'].some(code => pincode.startsWith(code))) {
        // Same day available
      } else if (pincode.startsWith('1') || pincode.startsWith('2')) {
        // Remove same-day delivery for northern/eastern regions
        availableOptions = availableOptions.filter(opt => opt.id !== 'same-day');
      } else {
        // Remote areas - increase delivery time and cost
        availableOptions = availableOptions.filter(opt => opt.id !== 'same-day');
        availableOptions.forEach(opt => {
          if (opt.id === 'standard') {
            opt.estimatedDays = '7-10 days';
            opt.price += 50;
          }
          if (opt.id === 'express') {
            opt.estimatedDays = '4-5 days';
            opt.price += 100;
          }
        });
      }

      setShippingOptions(availableOptions);
      if (availableOptions.length > 0 && !selectedOption) {
        const defaultOption = availableOptions[0];
        setSelectedOption(defaultOption.id);
        onShippingSelect(defaultOption, defaultOption.price);
      }
    } catch (err) {
      setError('Failed to calculate shipping. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePincode = (value: string) => {
    const isValid = /^[1-9][0-9]{5}$/.test(value);
    setIsValidPincode(isValid);
    return isValid;
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    
    if (validatePincode(value)) {
      calculateShipping(value);
    } else {
      setShippingOptions([]);
      setSelectedOption('');
    }
  };

  const handleOptionSelect = (option: ShippingOption) => {
    setSelectedOption(option.id);
    onShippingSelect(option, option.price);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'package': return <Package className="w-5 h-5" />;
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'mappin': return <MapPin className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-gray-900">Shipping Calculator</h3>
      </div>

      {/* Pincode Input */}
      <div className="mb-4">
        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Pincode
        </label>
        <div className="relative">
          <input
            id="pincode"
            type="text"
            value={pincode}
            onChange={handlePincodeChange}
            placeholder="e.g., 400001"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              pincode && !isValidPincode ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={6}
          />
          {isLoading && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        {pincode && !isValidPincode && (
          <p className="text-sm text-red-600 mt-1">Please enter a valid 6-digit pincode</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Shipping Options */}
      {shippingOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Available Options:</h4>
          {shippingOptions.map((option) => (
            <motion.div
              key={option.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === option.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionSelect(option)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedOption === option.id ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    {getIconComponent(option.icon)}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{option.name}</h5>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-xs text-gray-500">{option.estimatedDays}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {option.price === 0 ? 'FREE' : `₹${option.price}`}
                  </p>
                  {selectedOption === option.id && (
                    <div className="w-4 h-4 bg-primary-600 rounded-full mt-1 ml-auto"></div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Free Shipping Promotion */}
      {productPrice < 999 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-medium">Free shipping</span> on orders above ₹999. 
            Add ₹{999 - productPrice} more to qualify!
          </p>
        </div>
      )}
    </div>
  );
}