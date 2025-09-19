/**
 * AI Sizing Assistant Service
 * Provides personalized fit recommendations using AI and user data
 */

export interface UserMeasurements {
  height: number; // in cm
  weight: number; // in kg
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  shoulderWidth?: number; // in cm
  inseam?: number; // in cm
  bodyType?: 'pear' | 'apple' | 'hourglass' | 'rectangle' | 'inverted-triangle';
  fitPreference?: 'tight' | 'fitted' | 'regular' | 'loose' | 'oversized';
}

export interface SizeRecommendation {
  size: string;
  confidence: number; // 0-100
  reasons: string[];
  alternatives: Array<{
    size: string;
    confidence: number;
    reason: string;
  }>;
  fitDescription: string;
  measurements: {
    chest?: string;
    waist?: string;
    length?: string;
    shoulders?: string;
  };
}

export interface ProductSizing {
  productId: string;
  category: string;
  brand: string;
  sizingType: 'standard' | 'oversized' | 'fitted' | 'loose';
  measurements: {
    [size: string]: {
      chest?: number;
      waist?: number;
      length?: number;
      shoulders?: number;
      hips?: number;
      inseam?: number;
    };
  };
  fitNotes?: string[];
}

export interface SizingData {
  purchases: Array<{
    productId: string;
    size: string;
    rating: number; // 1-5
    fitFeedback: 'too_small' | 'perfect' | 'too_large';
    category: string;
    brand: string;
  }>;
  returns: Array<{
    productId: string;
    size: string;
    reason: 'too_small' | 'too_large' | 'poor_quality' | 'other';
    category: string;
  }>;
  measurements: UserMeasurements;
  preferences: {
    preferredBrands: string[];
    preferredCategories: string[];
    preferredFit: string;
  };
}

class AISizingAssistant {
  private baseUrl = '/api/sizing';

  /**
   * Get size recommendation for a product
   */
  async getSizeRecommendation(
    productId: string,
    userId?: string,
    userMeasurements?: UserMeasurements
  ): Promise<SizeRecommendation> {
    try {
      const response = await fetch(`${this.baseUrl}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          userId,
          userMeasurements
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get size recommendation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting size recommendation:', error);
      throw error;
    }
  }

  /**
   * Analyze user's sizing data to improve recommendations
   */
  async analyzeSizingData(userId: string): Promise<SizingData> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to analyze sizing data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing sizing data:', error);
      throw error;
    }
  }

  /**
   * Save user measurements
   */
  async saveMeasurements(userId: string, measurements: UserMeasurements): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/measurements/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(measurements)
      });

      if (!response.ok) {
        throw new Error('Failed to save measurements');
      }
    } catch (error) {
      console.error('Error saving measurements:', error);
      throw error;
    }
  }

  /**
   * Get user measurements
   */
  async getMeasurements(userId: string): Promise<UserMeasurements | null> {
    try {
      const response = await fetch(`${this.baseUrl}/measurements/${userId}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to get measurements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting measurements:', error);
      return null;
    }
  }

  /**
   * Record fit feedback for purchased items
   */
  async recordFitFeedback(
    userId: string,
    productId: string,
    size: string,
    feedback: 'too_small' | 'perfect' | 'too_large',
    rating: number
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          productId,
          size,
          feedback,
          rating
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record feedback');
      }
    } catch (error) {
      console.error('Error recording feedback:', error);
      throw error;
    }
  }

  /**
   * Get size chart for a product
   */
  async getProductSizeChart(productId: string): Promise<ProductSizing | null> {
    try {
      const response = await fetch(`${this.baseUrl}/size-chart/${productId}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to get size chart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting size chart:', error);
      return null;
    }
  }

  /**
   * Compare sizes across different brands
   */
  async compareBrandSizing(
    category: string,
    userSize: string,
    fromBrand: string,
    toBrand: string
  ): Promise<{
    recommendedSize: string;
    confidence: number;
    notes: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/compare-brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category,
          userSize,
          fromBrand,
          toBrand
        })
      });

      if (!response.ok) {
        throw new Error('Failed to compare brand sizing');
      }

      return await response.json();
    } catch (error) {
      console.error('Error comparing brand sizing:', error);
      throw error;
    }
  }

  /**
   * Get body type recommendation
   */
  async getBodyTypeRecommendation(measurements: UserMeasurements): Promise<{
    bodyType: string;
    confidence: number;
    recommendations: string[];
    stylingTips: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/body-type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(measurements)
      });

      if (!response.ok) {
        throw new Error('Failed to get body type recommendation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting body type recommendation:', error);
      throw error;
    }
  }

  /**
   * Get virtual try-on recommendation
   */
  async getVirtualTryOn(
    productId: string,
    userMeasurements: UserMeasurements
  ): Promise<{
    fit: 'excellent' | 'good' | 'fair' | 'poor';
    visualization: string; // URL to generated image
    recommendations: string[];
    adjustments: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/virtual-try-on`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          userMeasurements
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get virtual try-on');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting virtual try-on:', error);
      throw error;
    }
  }

  /**
   * Calculate size recommendation using AI
   */
  private calculateRecommendation(
    productSizing: ProductSizing,
    userMeasurements: UserMeasurements,
    sizingData?: SizingData
  ): SizeRecommendation {
    const { measurements, category, sizingType } = productSizing;
    const { height, weight, chest, waist, fitPreference } = userMeasurements;

    // AI scoring algorithm
    const scores: { [size: string]: number } = {};
    const reasons: { [size: string]: string[] } = {};

    // Calculate BMI for basic fit assessment
    const bmi = weight / Math.pow(height / 100, 2);

    for (const [size, sizeMeasurements] of Object.entries(measurements)) {
      let score = 0;
      const sizeReasons: string[] = [];

      // Chest fit scoring
      if (chest && sizeMeasurements.chest) {
        const chestDiff = Math.abs(chest - sizeMeasurements.chest);
        if (chestDiff <= 2) {
          score += 30;
          sizeReasons.push('Perfect chest fit');
        } else if (chestDiff <= 5) {
          score += 20;
          sizeReasons.push('Good chest fit');
        } else if (chestDiff <= 10) {
          score += 10;
          sizeReasons.push('Acceptable chest fit');
        } else {
          score -= 10;
          sizeReasons.push('Poor chest fit');
        }
      }

      // Waist fit scoring
      if (waist && sizeMeasurements.waist) {
        const waistDiff = Math.abs(waist - sizeMeasurements.waist);
        if (waistDiff <= 2) {
          score += 25;
          sizeReasons.push('Perfect waist fit');
        } else if (waistDiff <= 5) {
          score += 15;
          sizeReasons.push('Good waist fit');
        } else if (waistDiff <= 10) {
          score += 5;
          sizeReasons.push('Acceptable waist fit');
        } else {
          score -= 15;
          sizeReasons.push('Poor waist fit');
        }
      }

      // Fit preference adjustment
      if (fitPreference) {
        switch (fitPreference) {
          case 'tight':
            if (chest && sizeMeasurements.chest && sizeMeasurements.chest <= chest + 2) {
              score += 15;
              sizeReasons.push('Matches tight fit preference');
            }
            break;
          case 'loose':
            if (chest && sizeMeasurements.chest && sizeMeasurements.chest >= chest + 8) {
              score += 15;
              sizeReasons.push('Matches loose fit preference');
            }
            break;
          case 'oversized':
            if (chest && sizeMeasurements.chest && sizeMeasurements.chest >= chest + 15) {
              score += 15;
              sizeReasons.push('Matches oversized preference');
            }
            break;
          default:
            if (chest && sizeMeasurements.chest && Math.abs(chest - sizeMeasurements.chest) <= 5) {
              score += 10;
              sizeReasons.push('Matches regular fit preference');
            }
        }
      }

      // Sizing type adjustment
      switch (sizingType) {
        case 'oversized':
          score += 5;
          sizeReasons.push('Designed for oversized fit');
          break;
        case 'fitted':
          if (fitPreference === 'tight' || fitPreference === 'fitted') {
            score += 10;
            sizeReasons.push('Fitted design matches preference');
          }
          break;
      }

      // Historical data scoring
      if (sizingData?.purchases) {
        const relevantPurchases = sizingData.purchases.filter(p => 
          p.category === category && p.size === size
        );
        
        for (const purchase of relevantPurchases) {
          if (purchase.fitFeedback === 'perfect') {
            score += 20;
            sizeReasons.push('Previous perfect fit in this size');
          } else if (purchase.fitFeedback === 'too_small') {
            score -= 15;
            sizeReasons.push('Previously too small in this size');
          } else if (purchase.fitFeedback === 'too_large') {
            score -= 15;
            sizeReasons.push('Previously too large in this size');
          }
        }
      }

      scores[size] = Math.max(0, Math.min(100, score));
      reasons[size] = sizeReasons;
    }

    // Find best size
    const bestSize = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];

    // Generate alternatives
    const alternatives = Object.entries(scores)
      .filter(([size]) => size !== bestSize)
      .map(([size, score]) => ({
        size,
        confidence: score,
        reason: reasons[size][0] || 'Alternative option'
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2);

    return {
      size: bestSize,
      confidence: scores[bestSize],
      reasons: reasons[bestSize] || [],
      alternatives,
      fitDescription: this.generateFitDescription(bestSize, productSizing, userMeasurements),
      measurements: {
        chest: measurements[bestSize]?.chest?.toString(),
        waist: measurements[bestSize]?.waist?.toString(),
        length: measurements[bestSize]?.length?.toString(),
        shoulders: measurements[bestSize]?.shoulders?.toString()
      }
    };
  }

  /**
   * Generate fit description
   */
  private generateFitDescription(
    size: string,
    productSizing: ProductSizing,
    userMeasurements: UserMeasurements
  ): string {
    const sizeMeasurements = productSizing.measurements[size];
    if (!sizeMeasurements) return 'Standard fit';

    const { chest, waist, fitPreference } = userMeasurements;
    const descriptions: string[] = [];

    if (chest && sizeMeasurements.chest) {
      const chestDiff = sizeMeasurements.chest - chest;
      if (chestDiff <= 2) {
        descriptions.push('snug through the chest');
      } else if (chestDiff <= 8) {
        descriptions.push('comfortable through the chest');
      } else {
        descriptions.push('relaxed through the chest');
      }
    }

    if (waist && sizeMeasurements.waist) {
      const waistDiff = sizeMeasurements.waist - waist;
      if (waistDiff <= 2) {
        descriptions.push('fitted at the waist');
      } else if (waistDiff <= 8) {
        descriptions.push('comfortable at the waist');
      } else {
        descriptions.push('loose at the waist');
      }
    }

    if (productSizing.sizingType === 'oversized') {
      descriptions.push('intentionally oversized design');
    }

    if (descriptions.length === 0) {
      return 'True to size fit';
    }

    return descriptions.join(', ');
  }
}

export default AISizingAssistant;