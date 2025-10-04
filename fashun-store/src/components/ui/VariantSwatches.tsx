'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Zap, Heart, Eye } from 'lucide-react';
import Image from 'next/image';

export interface Variant {
  id: string;
  name: string;
  type: 'color' | 'pattern' | 'material' | 'size';
  value: string; // hex code for colors, image URL for patterns, or text for sizes
  price?: number;
  priceModifier?: number; // +5 or -10 for price changes
  stock: number;
  image?: string; // product image for this variant
  isPopular?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
}

export interface VariantGroup {
  name: string;
  type: 'color' | 'pattern' | 'material' | 'size';
  variants: Variant[];
  required?: boolean;
}

interface VariantSwatchesProps {
  variantGroups: VariantGroup[];
  selectedVariants: Record<string, string>; // group name -> variant id
  onVariantChange: (groupName: string, variantId: string) => void;
  basePrice?: number;
  showPriceModifiers?: boolean;
  showStock?: boolean;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
}

const VariantSwatches: React.FC<VariantSwatchesProps> = ({
  variantGroups,
  selectedVariants,
  onVariantChange,
  basePrice,
  showPriceModifiers = true,
  showStock = true,
  showLabels = true,
  size = 'medium',
  layout = 'vertical',
  className = ''
}) => {
  const [hoveredVariant, setHoveredVariant] = useState<string | null>(null);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          swatch: 'w-8 h-8 text-xs',
          sizeSwatch: 'px-2 py-1 text-xs',
          label: 'text-xs',
          price: 'text-xs'
        };
      case 'large':
        return {
          swatch: 'w-16 h-16 text-lg',
          sizeSwatch: 'px-4 py-3 text-base',
          label: 'text-base',
          price: 'text-sm'
        };
      default:
        return {
          swatch: 'w-12 h-12 text-sm',
          sizeSwatch: 'px-3 py-2 text-sm',
          label: 'text-sm',
          price: 'text-xs'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const isVariantSelected = (groupName: string, variantId: string) => {
    return selectedVariants[groupName] === variantId;
  };

  const isVariantAvailable = (variant: Variant) => {
    return variant.stock > 0;
  };

  const getVariantPrice = (variant: Variant) => {
    if (!basePrice || !variant.priceModifier) return null;
    const finalPrice = basePrice + variant.priceModifier;
    const modifier = variant.priceModifier > 0 ? '+' : '';
    return {
      final: finalPrice,
      modifier: `${modifier}$${Math.abs(variant.priceModifier)}`
    };
  };

  const ColorSwatch: React.FC<{ variant: Variant; groupName: string; isSelected: boolean }> = ({
    variant,
    groupName,
    isSelected
  }) => {
    const isAvailable = isVariantAvailable(variant);
    const price = getVariantPrice(variant);

    return (
      <div className="relative group">
        <button
          onClick={() => isAvailable && onVariantChange(groupName, variant.id)}
          onMouseEnter={() => setHoveredVariant(variant.id)}
          onMouseLeave={() => setHoveredVariant(null)}
          disabled={!isAvailable}
          className={`
            ${sizeClasses.swatch} relative rounded-full border-2 transition-all duration-200
            ${isSelected 
              ? 'border-accent-400 ring-2 ring-accent-400/30 scale-110' 
              : 'border-white/20 hover:border-white/40'
            }
            ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            shadow-lg hover:shadow-xl
          `}
          style={{ backgroundColor: variant.value }}
        >
          {/* Checkmark for selected */}
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-4 h-4 text-white drop-shadow-lg" />
            </div>
          )}

          {/* Badges */}
          {variant.isNew && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white/50 animate-pulse"></div>
          )}
          {variant.isLimited && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white/50">
              <Zap className="w-2 h-2 text-white m-0.5" />
            </div>
          )}

          {/* Out of stock overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <div className="w-full h-0.5 bg-white/70 transform rotate-45"></div>
            </div>
          )}
        </button>

        {/* Tooltip */}
        {(hoveredVariant === variant.id || isSelected) && (
          <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                        bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/20 
                        text-xs font-medium whitespace-nowrap shadow-xl">
            <div className="text-center">
              <div>{variant.name}</div>
              {price && showPriceModifiers && (
                <div className="text-accent-400">{price.modifier}</div>
              )}
              {showStock && (
                <div className={`${variant.stock < 5 ? 'text-red-300' : 'text-green-300'}`}>
                  {variant.stock > 0 ? `${variant.stock} left` : 'Out of stock'}
                </div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                          border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
          </div>
        )}
      </div>
    );
  };

  const PatternSwatch: React.FC<{ variant: Variant; groupName: string; isSelected: boolean }> = ({
    variant,
    groupName,
    isSelected
  }) => {
    const isAvailable = isVariantAvailable(variant);

    return (
      <div className="relative group">
        <button
          onClick={() => isAvailable && onVariantChange(groupName, variant.id)}
          disabled={!isAvailable}
          className={`
            ${sizeClasses.swatch} relative rounded-lg border-2 transition-all duration-200 overflow-hidden
            ${isSelected 
              ? 'border-accent-400 ring-2 ring-accent-400/30 scale-105' 
              : 'border-white/20 hover:border-white/40'
            }
            ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
          `}
        >
          <Image
            src={variant.value}
            alt={variant.name}
            fill
            className="object-cover"
          />
          
          {isSelected && (
            <div className="absolute inset-0 bg-accent-400/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-white drop-shadow-lg" />
            </div>
          )}
          
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/70 transform rotate-45"></div>
            </div>
          )}
        </button>
      </div>
    );
  };

  const SizeSwatch: React.FC<{ variant: Variant; groupName: string; isSelected: boolean }> = ({
    variant,
    groupName,
    isSelected
  }) => {
    const isAvailable = isVariantAvailable(variant);
    const price = getVariantPrice(variant);

    return (
      <div className="relative group">
        <button
          onClick={() => isAvailable && onVariantChange(groupName, variant.id)}
          disabled={!isAvailable}
          className={`
            ${sizeClasses.sizeSwatch} relative rounded-lg border-2 transition-all duration-200 font-medium
            ${isSelected 
              ? 'border-accent-400 bg-accent-400/20 text-accent-300' 
              : 'border-white/20 hover:border-white/40 text-white hover:bg-white/5'
            }
            ${!isAvailable ? 'opacity-40 cursor-not-allowed text-gray-500' : 'cursor-pointer'}
            ${variant.isPopular ? 'ring-2 ring-yellow-400/30' : ''}
          `}
        >
          <div className="text-center">
            <div className={sizeClasses.label}>{variant.name}</div>
            {price && showPriceModifiers && (
              <div className={`${sizeClasses.price} text-accent-400 font-semibold`}>
                {price.modifier}
              </div>
            )}
          </div>

          {/* Popular badge */}
          {variant.isPopular && (
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-2 py-0.5 
                          rounded-full text-xs font-bold">
              Popular
            </div>
          )}

          {/* Stock indicator */}
          {showStock && variant.stock > 0 && variant.stock < 5 && (
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>

        {/* Low stock warning */}
        {showStock && variant.stock > 0 && variant.stock < 3 && isSelected && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 
                        bg-red-500/20 border border-red-500/30 text-red-300 px-2 py-1 
                        rounded-md text-xs font-medium whitespace-nowrap">
            Only {variant.stock} left!
          </div>
        )}
      </div>
    );
  };

  const renderVariantGroup = (group: VariantGroup) => {
    const selectedVariant = group.variants.find(v => isVariantSelected(group.name, v.id));

    return (
      <div key={group.name} className="space-y-3">
        {/* Group Header */}
        {showLabels && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-white">
                {group.name}
                {group.required && <span className="text-red-400 ml-1">*</span>}
              </h4>
              {selectedVariant && (
                <span className="text-xs text-gray-400">
                  - {selectedVariant.name}
                </span>
              )}
            </div>
            {selectedVariant && showPriceModifiers && selectedVariant.priceModifier && (
              <span className="text-xs text-accent-400 font-medium">
                {selectedVariant.priceModifier > 0 ? '+' : ''}${Math.abs(selectedVariant.priceModifier)}
              </span>
            )}
          </div>
        )}

        {/* Variants */}
        <div className={`
          flex items-center gap-3 flex-wrap
          ${layout === 'grid' ? 'grid grid-cols-4 gap-2' : ''}
        `}>
          {group.variants.map(variant => {
            const isSelected = isVariantSelected(group.name, variant.id);

            switch (variant.type) {
              case 'color':
                return (
                  <ColorSwatch
                    key={variant.id}
                    variant={variant}
                    groupName={group.name}
                    isSelected={isSelected}
                  />
                );
              case 'pattern':
              case 'material':
                return (
                  <PatternSwatch
                    key={variant.id}
                    variant={variant}
                    groupName={group.name}
                    isSelected={isSelected}
                  />
                );
              case 'size':
                return (
                  <SizeSwatch
                    key={variant.id}
                    variant={variant}
                    groupName={group.name}
                    isSelected={isSelected}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {variantGroups.map(renderVariantGroup)}
    </div>
  );
};

export default VariantSwatches;