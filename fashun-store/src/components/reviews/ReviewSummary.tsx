'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users, Award, Image as ImageIcon, Video, MessageCircle } from 'lucide-react';
import AdvancedReviewForm from './AdvancedReviewForm';

interface ReviewSummaryProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
  reviewDistribution: { [key: string]: number };
  fitConsensus?: string;
  averageQualityRating?: number;
  averageComfortRating?: number;
  averageStyleRating?: number;
  averageValueRating?: number;
  recommendationPercentage: number;
  recentReviewsPreview?: any[];
}

export default function ReviewSummary({
  productId,
  averageRating,
  reviewCount,
  reviewDistribution,
  fitConsensus,
  averageQualityRating,
  averageComfortRating,
  averageStyleRating,
  averageValueRating,
  recommendationPercentage,
  recentReviewsPreview = []
}: ReviewSummaryProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const getRatingPercentage = (rating: number) => {
    return reviewCount > 0 ? Math.round((reviewDistribution[rating] / reviewCount) * 100) : 0;
  };

  const handleSubmitReview = async (reviewData: any) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setShowReviewForm(false);
        // Refresh page or show success message
        window.location.reload();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const formatRating = (rating?: number) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const getFitLabel = (fit?: string) => {
    const labels = {
      runs_small: 'Runs Small',
      true_to_size: 'True to Size',
      runs_large: 'Runs Large'
    };
    return fit ? labels[fit as keyof typeof labels] : 'No consensus';
  };

  const getFitColor = (fit?: string) => {
    const colors = {
      runs_small: 'text-red-600 bg-red-50',
      true_to_size: 'text-green-600 bg-green-50',
      runs_large: 'text-blue-600 bg-blue-50'
    };
    return fit ? colors[fit as keyof typeof colors] : 'text-gray-600 bg-gray-50';
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${
                    star <= Math.round(averageRating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} />
                ))}
              </div>
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({reviewCount} reviews)</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Write Review
          </button>
        </div>

        {reviewCount > 0 ? (
          <>
            {/* Rating Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm">{rating}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-yellow-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${getRatingPercentage(rating)}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">
                        {getRatingPercentage(rating)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Ratings */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Detailed Ratings</h4>
                <div className="space-y-3">
                  {averageQualityRating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Quality</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3 h-3 ${
                              star <= Math.round(averageQualityRating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{formatRating(averageQualityRating)}</span>
                      </div>
                    </div>
                  )}
                  
                  {averageComfortRating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Comfort</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3 h-3 ${
                              star <= Math.round(averageComfortRating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{formatRating(averageComfortRating)}</span>
                      </div>
                    </div>
                  )}
                  
                  {averageStyleRating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Style</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3 h-3 ${
                              star <= Math.round(averageStyleRating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{formatRating(averageStyleRating)}</span>
                      </div>
                    </div>
                  )}
                  
                  {averageValueRating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Value</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3 h-3 ${
                              star <= Math.round(averageValueRating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{formatRating(averageValueRating)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{recommendationPercentage}%</div>
                <div className="text-sm text-green-700">Would Recommend</div>
              </div>

              {fitConsensus && (
                <div className="text-center p-4 rounded-lg">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFitColor(fitConsensus)}`}>
                    {getFitLabel(fitConsensus)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Fit Consensus</div>
                </div>
              )}

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{reviewCount}</div>
                <div className="text-sm text-purple-700">Total Reviews</div>
              </div>
            </div>

            {/* Recent Reviews Preview */}
            {recentReviewsPreview.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Reviews</h4>
                <div className="space-y-4">
                  {recentReviewsPreview.slice(0, 3).map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${
                              star <= review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} />
                          ))}
                        </div>
                        {review.verified_purchase && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{review.content}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{review.reviewer_name}</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <a 
                    href={`#reviews`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View All {reviewCount} Reviews →
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Reviews State */
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
            <p className="text-gray-600 mb-4">
              Be the first to share your experience with this product.
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Write the First Review
            </button>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <AdvancedReviewForm
          productId={productId}
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </>
  );
}
