'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Camera, 
  Video,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  SortAsc,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  reviewer_name: string;
  verified_purchase: boolean;
  createdAt: string;
  size_purchased?: string;
  fit_rating?: string;
  quality_rating?: number;
  comfort_rating?: number;
  style_rating?: number;
  value_rating?: number;
  would_recommend: boolean;
  images?: any[];
  videos?: any[];
  helpful_votes: number;
  total_votes: number;
  response_from_store?: string;
  response_date?: string;
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
  reviewDistribution: { [key: string]: number };
  fitConsensus?: string;
  recommendationPercentage: number;
}

export default function ProductReviews({ 
  productId, 
  averageRating, 
  reviewCount, 
  reviewDistribution,
  fitConsensus,
  recommendationPercentage 
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allMedia, setAllMedia] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, [productId, filter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        productId,
        filter,
        sortBy,
        limit: '20'
      });

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();
      
      setReviews(data.reviews || []);
      
      // Collect all media for gallery
      const media: any[] = [];
      data.reviews?.forEach((review: Review) => {
        review.images?.forEach((img: any) => media.push({ ...img, type: 'image', reviewId: review.id }));
        review.videos?.forEach((vid: any) => media.push({ ...vid, type: 'video', reviewId: review.id }));
      });
      setAllMedia(media);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reviewId: string, helpful: boolean) => {
    try {
      await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful })
      });
      
      // Refresh reviews to get updated vote counts
      fetchReviews();
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const handleFlag = async (reviewId: string, reason: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      alert('Review has been flagged for moderation. Thank you for your feedback.');
    } catch (error) {
      console.error('Error flagging review:', error);
    }
  };

  const openMediaModal = (media: any, index: number) => {
    setSelectedMedia(media);
    setCurrentMediaIndex(index);
    setShowMediaModal(true);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentMediaIndex - 1 + allMedia.length) % allMedia.length
      : (currentMediaIndex + 1) % allMedia.length;
    
    setCurrentMediaIndex(newIndex);
    setSelectedMedia(allMedia[newIndex]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingPercentage = (rating: number) => {
    return reviewCount > 0 ? Math.round((reviewDistribution[rating] / reviewCount) * 100) : 0;
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'verified') return review.verified_purchase;
    if (filter === 'media') return (review.images?.length || 0) > 0 || (review.videos?.length || 0) > 0;
    if (filter === 'recommended') return review.would_recommend;
    return review.rating === parseInt(filter);
  });

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Review Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${
                      star <= Math.round(averageRating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Recommendation Percentage */}
            <div className="text-center lg:text-left">
              <div className="text-lg font-semibold text-green-600">
                {recommendationPercentage}% recommend this product
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-10 text-right">
                  {getRatingPercentage(rating)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
          {fitConsensus && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {fitConsensus.replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">Most common fit</div>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {allMedia.filter(m => m.type === 'image').length}
            </div>
            <div className="text-sm text-gray-600">Customer photos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {allMedia.filter(m => m.type === 'video').length}
            </div>
            <div className="text-sm text-gray-600">Customer videos</div>
          </div>
        </div>
      </div>

      {/* Customer Media Gallery */}
      {allMedia.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Customer Photos & Videos</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {allMedia.slice(0, 16).map((media, index) => (
              <button
                key={index}
                onClick={() => openMediaModal(media, index)}
                className="relative aspect-square rounded-lg overflow-hidden group hover:scale-105 transition-transform"
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Customer photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gray-900">
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
              </button>
            ))}
            {allMedia.length > 16 && (
              <button
                onClick={() => openMediaModal(allMedia[16], 16)}
                className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs">+{allMedia.length - 16}</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters & Sorting */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({reviewCount})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'verified' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verified Purchase
            </button>
            <button
              onClick={() => setFilter('media')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'media' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              With Photos/Videos
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilter(rating.toString())}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  filter === rating.toString() ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rating} <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {/* Review Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${
                          star <= review.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} />
                      ))}
                    </div>
                    <span className="font-medium">{review.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{review.reviewer_name}</span>
                    {review.verified_purchase && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Verified Purchase
                      </span>
                    )}
                    <span>{formatDate(review.createdAt)}</span>
                    {review.size_purchased && (
                      <span>Size: {review.size_purchased}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleFlag(review.id, 'inappropriate')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Detailed Ratings */}
              {(review.quality_rating || review.comfort_rating || review.style_rating || review.value_rating) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  {review.quality_rating && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Quality</div>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${
                            star <= review.quality_rating! 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                    </div>
                  )}
                  {review.comfort_rating && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Comfort</div>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${
                            star <= review.comfort_rating! 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                    </div>
                  )}
                  {review.style_rating && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Style</div>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${
                            star <= review.style_rating! 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                    </div>
                  )}
                  {review.value_rating && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Value</div>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${
                            star <= review.value_rating! 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>

              {/* Fit Information */}
              {review.fit_rating && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    Fit: {review.fit_rating.replace('_', ' ')}
                  </div>
                </div>
              )}

              {/* Media Attachments */}
              {((review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)) && (
                <div className="mb-4">
                  <div className="grid grid-cols-4 gap-2">
                    {review.images?.map((image, imageIndex) => (
                      <button
                        key={imageIndex}
                        onClick={() => openMediaModal(image, allMedia.findIndex(m => m.id === image.id))}
                        className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform"
                      >
                        <img
                          src={image.url}
                          alt="Review image"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    {review.videos?.map((video, videoIndex) => (
                      <button
                        key={videoIndex}
                        onClick={() => openMediaModal(video, allMedia.findIndex(m => m.id === video.id))}
                        className="relative aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform"
                      >
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Store Response */}
              {review.response_from_store && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Response from FUC! Team
                  </div>
                  <p className="text-gray-700 text-sm">{review.response_from_store}</p>
                  {review.response_date && (
                    <div className="text-xs text-gray-500 mt-2">
                      {formatDate(review.response_date)}
                    </div>
                  )}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  {review.would_recommend && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Recommends this product
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Was this helpful?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(review.id, true)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {review.helpful_votes}
                    </button>
                    <button
                      onClick={() => handleVote(review.id, false)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No reviews found for the selected filters.</div>
          </div>
        )}
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {showMediaModal && selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setShowMediaModal(false)}
          >
            <div className="relative max-w-4xl max-h-4xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowMediaModal(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt="Review media"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                />
              )}

              {/* Navigation */}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={() => navigateMedia('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => navigateMedia('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Media Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {currentMediaIndex + 1} / {allMedia.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
