'use client';

import React, { useState, useEffect } from 'react';
import { Ruler, User, TrendingUp, AlertCircle, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import AISizingAssistant, { UserMeasurements, SizeRecommendation, ProductSizing } from '@/lib/ai-sizing-assistant';

interface SizingAssistantProps {
  productId: string;
  currentSize?: string;
  userId?: string;
  onSizeSelect?: (size: string) => void;
  className?: string;
}

const SizingAssistant: React.FC<SizingAssistantProps> = ({
  productId,
  currentSize,
  userId,
  onSizeSelect,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
  const [userMeasurements, setUserMeasurements] = useState<UserMeasurements | null>(null);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [sizeChart, setSizeChart] = useState<ProductSizing | null>(null);
  const [measurementForm, setMeasurementForm] = useState<Partial<UserMeasurements>>({});

  const sizingAssistant = new AISizingAssistant();

  useEffect(() => {
    if (userId) {
      loadUserMeasurements();
    }
    loadSizeChart();
  }, [userId, productId]);

  useEffect(() => {
    if (userMeasurements) {
      getRecommendation();
    }
  }, [userMeasurements, productId]);

  const loadUserMeasurements = async () => {
    if (!userId) return;

    try {
      const measurements = await sizingAssistant.getMeasurements(userId);
      setUserMeasurements(measurements);
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const loadSizeChart = async () => {
    try {
      const chart = await sizingAssistant.getProductSizeChart(productId);
      setSizeChart(chart);
    } catch (error) {
      console.error('Error loading size chart:', error);
    }
  };

  const getRecommendation = async () => {
    if (!userMeasurements) return;

    setLoading(true);
    try {
      const rec = await sizingAssistant.getSizeRecommendation(
        productId,
        userId,
        userMeasurements
      );
      setRecommendation(rec);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMeasurements = async () => {
    if (!userId || !measurementForm.height || !measurementForm.weight) return;

    setLoading(true);
    try {
      await sizingAssistant.saveMeasurements(userId, measurementForm as UserMeasurements);
      setUserMeasurements(measurementForm as UserMeasurements);
      setShowMeasurements(false);
      setMeasurementForm({});
    } catch (error) {
      console.error('Error saving measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeSelect = (size: string) => {
    onSizeSelect?.(size);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'High confidence';
    if (confidence >= 60) return 'Medium confidence';
    return 'Low confidence';
  };

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Ruler className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Sizing Assistant</h3>
        </div>
        {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
      </div>

      {/* Size Recommendation */}
      {recommendation && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-lg font-semibold text-blue-900">
                  Recommended Size: {recommendation.size}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                {getConfidenceText(recommendation.confidence)}
              </span>
            </div>
            
            <p className="text-blue-800 mb-3">{recommendation.fitDescription}</p>
            
            <div className="mb-3">
              <div className="text-sm font-medium text-blue-900 mb-1">Why this size?</div>
              <ul className="text-sm text-blue-800 space-y-1">
                {recommendation.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-3 h-3 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSizeSelect(recommendation.size)}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select Size {recommendation.size}
            </button>
          </div>

          {/* Alternative Sizes */}
          {recommendation.alternatives.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Alternative sizes:</div>
              <div className="space-y-2">
                {recommendation.alternatives.map((alt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">Size {alt.size}</span>
                      <p className="text-sm text-gray-600">{alt.reason}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getConfidenceColor(alt.confidence)}`}>
                        {alt.confidence}%
                      </span>
                      <button
                        onClick={() => handleSizeSelect(alt.size)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Measurements Message */}
      {!userMeasurements && userId && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Get personalized size recommendations</p>
              <p className="text-yellow-700 text-sm mt-1">
                Add your measurements to get AI-powered size suggestions tailored to your body.
              </p>
              <button
                onClick={() => setShowMeasurements(true)}
                className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                Add Measurements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Measurement Form */}
      {showMeasurements && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Your Measurements</h4>
            <button
              onClick={() => setShowMeasurements(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm) *
              </label>
              <input
                type="number"
                value={measurementForm.height || ''}
                onChange={(e) => setMeasurementForm(prev => ({ ...prev, height: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="170"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                value={measurementForm.weight || ''}
                onChange={(e) => setMeasurementForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chest (cm)
              </label>
              <input
                type="number"
                value={measurementForm.chest || ''}
                onChange={(e) => setMeasurementForm(prev => ({ ...prev, chest: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="96"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waist (cm)
              </label>
              <input
                type="number"
                value={measurementForm.waist || ''}
                onChange={(e) => setMeasurementForm(prev => ({ ...prev, waist: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="80"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fit Preference
              </label>
              <select
                value={measurementForm.fitPreference || ''}
                onChange={(e) => setMeasurementForm(prev => ({ ...prev, fitPreference: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select preference</option>
                <option value="tight">Tight</option>
                <option value="fitted">Fitted</option>
                <option value="regular">Regular</option>
                <option value="loose">Loose</option>
                <option value="oversized">Oversized</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowMeasurements(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveMeasurements}
              disabled={!measurementForm.height || !measurementForm.weight || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Measurements'}
            </button>
          </div>
        </div>
      )}

      {/* Size Chart */}
      <div className="mb-4">
        <button
          onClick={() => setShowSizeChart(!showSizeChart)}
          className="flex items-center justify-between w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">Size Chart</span>
          {showSizeChart ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showSizeChart && sizeChart && (
          <div className="mt-3 p-4 border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Size</th>
                    {sizeChart.measurements[Object.keys(sizeChart.measurements)[0]] && (
                      <>
                        {sizeChart.measurements[Object.keys(sizeChart.measurements)[0]].chest && (
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Chest (cm)</th>
                        )}
                        {sizeChart.measurements[Object.keys(sizeChart.measurements)[0]].waist && (
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Waist (cm)</th>
                        )}
                        {sizeChart.measurements[Object.keys(sizeChart.measurements)[0]].length && (
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Length (cm)</th>
                        )}
                        {sizeChart.measurements[Object.keys(sizeChart.measurements)[0]].shoulders && (
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Shoulders (cm)</th>
                        )}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeChart.measurements).map(([size, measurements]) => (
                    <tr key={size} className={`border-b border-gray-100 ${currentSize === size ? 'bg-blue-50' : ''}`}>
                      <td className="py-2 px-3 font-medium">{size}</td>
                      {measurements.chest && <td className="py-2 px-3">{measurements.chest}</td>}
                      {measurements.waist && <td className="py-2 px-3">{measurements.waist}</td>}
                      {measurements.length && <td className="py-2 px-3">{measurements.length}</td>}
                      {measurements.shoulders && <td className="py-2 px-3">{measurements.shoulders}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sizeChart.fitNotes && sizeChart.fitNotes.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 mb-2">Fit Notes:</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  {sizeChart.fitNotes.map((note, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guest Message */}
      {!userId && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start">
            <User className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-gray-700 font-medium">Want personalized size recommendations?</p>
              <p className="text-gray-600 text-sm mt-1">
                Sign in to save your measurements and get AI-powered size suggestions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizingAssistant;