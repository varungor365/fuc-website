'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  StarIcon,
  PhotoIcon,
  VideoCameraIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  verified: boolean
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  notHelpful: number
  images: string[]
  videos: string[]
  size?: string
  fit?: 'too_small' | 'perfect' | 'too_large'
  quality: number
  valueForMoney: number
  recommended: boolean
  userHasVoted?: 'helpful' | 'not_helpful' | null
}

interface ReviewsProps {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Arjun K.',
    userAvatar: '/api/placeholder/40/40',
    verified: true,
    rating: 5,
    title: 'Excellent quality and fit!',
    comment: 'This hoodie exceeded my expectations. The material is soft and comfortable, perfect for the winter season. The fit is exactly as described in the size chart.',
    date: '2025-09-10',
    helpful: 24,
    notHelpful: 2,
    images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
    videos: [],
    size: 'L',
    fit: 'perfect',
    quality: 5,
    valueForMoney: 4,
    recommended: true
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Priya S.',
    userAvatar: '/api/placeholder/40/40',
    verified: true,
    rating: 4,
    title: 'Good product but color slightly different',
    comment: 'The hoodie quality is great and very comfortable. However, the color in person is slightly different from what I expected based on the website photos. Still happy with the purchase.',
    date: '2025-09-08',
    helpful: 18,
    notHelpful: 5,
    images: ['/api/placeholder/300/300'],
    videos: ['/api/placeholder/video.mp4'],
    size: 'M',
    fit: 'perfect',
    quality: 4,
    valueForMoney: 4,
    recommended: true
  }
]

export default function ProductReviews({ productId, averageRating, totalReviews, ratingDistribution }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1' | 'media'>('all')
  const [expandedImages, setExpandedImages] = useState<{[key: string]: boolean}>({})
  const [videoPlaying, setVideoPlaying] = useState<{[key: string]: boolean}>({})

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    size: '',
    fit: '',
    quality: 0,
    valueForMoney: 0,
    recommended: true,
    images: [] as File[],
    videos: [] as File[]
  })

  const sortedAndFilteredReviews = reviews
    .filter(review => {
      if (filterBy === 'all') return true
      if (filterBy === 'media') return review.images.length > 0 || review.videos.length > 0
      return review.rating === parseInt(filterBy)
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'helpful':
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

  const handleVote = (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        const currentVote = review.userHasVoted
        let newHelpful = review.helpful
        let newNotHelpful = review.notHelpful

        // Remove previous vote if exists
        if (currentVote === 'helpful') newHelpful--
        if (currentVote === 'not_helpful') newNotHelpful--

        // Add new vote if different from current
        if (currentVote !== voteType) {
          if (voteType === 'helpful') newHelpful++
          if (voteType === 'not_helpful') newNotHelpful++
          
          return {
            ...review,
            helpful: newHelpful,
            notHelpful: newNotHelpful,
            userHasVoted: voteType
          }
        } else {
          // Remove vote if same as current
          return {
            ...review,
            helpful: newHelpful,
            notHelpful: newNotHelpful,
            userHasVoted: null
          }
        }
      }
      return review
    }))
  }

  const handleSubmitReview = () => {
    if (!newReview.rating || !newReview.title || !newReview.comment) {
      alert('Please fill in all required fields')
      return
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      verified: true,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0,
      images: newReview.images.map((_, index) => `/api/placeholder/300/300`), // Mock URLs
      videos: newReview.videos.map((_, index) => `/api/placeholder/video${index}.mp4`), // Mock URLs
      size: newReview.size,
      fit: newReview.fit as 'too_small' | 'perfect' | 'too_large',
      quality: newReview.quality,
      valueForMoney: newReview.valueForMoney,
      recommended: newReview.recommended
    }

    setReviews([review, ...reviews])
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      size: '',
      fit: '',
      quality: 0,
      valueForMoney: 0,
      recommended: true,
      images: [],
      videos: []
    })
    setShowReviewForm(false)
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolid
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderInteractiveStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-colors hover:scale-110"
          >
            <StarSolid
              className={`w-6 h-6 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Reviews Overview */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
              <div className="text-5xl font-bold text-white">{averageRating.toFixed(1)}</div>
              <div>
                {renderStars(averageRating, 'lg')}
                <p className="text-gray-400 text-sm mt-1">Based on {totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm text-gray-400 w-6">{star}</span>
                <StarSolid className="w-4 h-4 text-yellow-400" />
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(ratingDistribution[star as keyof typeof ratingDistribution] / totalReviews) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8">
                  {ratingDistribution[star as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <StarIcon className="w-5 h-5" />
            <span>Write a Review</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">All Reviews</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
              <option value="media">With Photos/Videos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Write Your Review</h3>
            
            <div className="space-y-6">
              {/* Overall Rating */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Overall Rating <span className="text-red-400">*</span>
                </label>
                {renderInteractiveStars(newReview.rating, (rating) => 
                  setNewReview({...newReview, rating})
                )}
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Review Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Summarize your experience..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Your Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Share details about your experience with this product..."
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Additional Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Quality</label>
                  {renderInteractiveStars(newReview.quality, (rating) => 
                    setNewReview({...newReview, quality: rating})
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Value for Money</label>
                  {renderInteractiveStars(newReview.valueForMoney, (rating) => 
                    setNewReview({...newReview, valueForMoney: rating})
                  )}
                </div>
              </div>

              {/* Size and Fit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Size Purchased</label>
                  <select
                    value={newReview.size}
                    onChange={(e) => setNewReview({...newReview, size: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">How did it fit?</label>
                  <select
                    value={newReview.fit}
                    onChange={(e) => setNewReview({...newReview, fit: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select fit</option>
                    <option value="too_small">Too Small</option>
                    <option value="perfect">Perfect Fit</option>
                    <option value="too_large">Too Large</option>
                  </select>
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-white font-medium mb-2">Add Photos & Videos</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Photo Upload */}
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                    <PhotoIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-2">Upload Photos</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          setNewReview({
                            ...newReview,
                            images: Array.from(e.target.files)
                          })
                        }
                      }}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="text-purple-400 text-sm cursor-pointer hover:text-purple-300">
                      Choose files
                    </label>
                    {newReview.images.length > 0 && (
                      <p className="text-green-400 text-xs mt-1">
                        {newReview.images.length} photo(s) selected
                      </p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                    <VideoCameraIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-2">Upload Videos</p>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          setNewReview({
                            ...newReview,
                            videos: Array.from(e.target.files)
                          })
                        }
                      }}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="text-purple-400 text-sm cursor-pointer hover:text-purple-300">
                      Choose files
                    </label>
                    {newReview.videos.length > 0 && (
                      <p className="text-green-400 text-xs mt-1">
                        {newReview.videos.length} video(s) selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newReview.recommended}
                    onChange={(e) => setNewReview({...newReview, recommended: e.target.checked})}
                    className="form-checkbox h-5 w-5 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-white">I would recommend this product to others</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={handleSubmitReview}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedAndFilteredReviews.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-12 text-center">
            <StarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-400 mb-6">Be the first to review this product!</p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Write First Review
            </button>
          </div>
        ) : (
          sortedAndFilteredReviews.map((review) => (
            <div key={review.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                    {review.userAvatar ? (
                      <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-400 m-2" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-medium">{review.userName}</h4>
                      {review.verified && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating, 'sm')}
                      <span className="text-gray-400 text-sm">{review.date}</span>
                    </div>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-gray-300">
                  <FlagIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h5 className="text-white font-medium mb-2">{review.title}</h5>
                <p className="text-gray-300 mb-4">{review.comment}</p>

                {/* Additional Info */}
                {(review.size || review.fit) && (
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                    {review.size && <span>Size: {review.size}</span>}
                    {review.fit && (
                      <span>
                        Fit: {review.fit === 'too_small' ? 'Too Small' : 
                              review.fit === 'perfect' ? 'Perfect' : 'Too Large'}
                      </span>
                    )}
                  </div>
                )}

                {/* Quality and Value Ratings */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Quality: </span>
                    {renderStars(review.quality, 'sm')}
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Value: </span>
                    {renderStars(review.valueForMoney, 'sm')}
                  </div>
                </div>
              </div>

              {/* Media */}
              {(review.images.length > 0 || review.videos.length > 0) && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Images */}
                    {review.images.map((image, index) => (
                      <div
                        key={`img-${index}`}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setExpandedImages({
                          ...expandedImages,
                          [`${review.id}-${index}`]: !expandedImages[`${review.id}-${index}`]
                        })}
                      >
                        <Image
                          src={image}
                          alt={`Review image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                    
                    {/* Videos */}
                    {review.videos.map((video, index) => (
                      <div
                        key={`vid-${index}`}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-900"
                        onClick={() => setVideoPlaying({
                          ...videoPlaying,
                          [`${review.id}-${index}`]: !videoPlaying[`${review.id}-${index}`]
                        })}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          Video
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(review.id, 'helpful')}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      review.userHasVoted === 'helpful'
                        ? 'text-green-400'
                        : 'text-gray-400 hover:text-green-400'
                    }`}
                  >
                    <HandThumbUpIcon className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(review.id, 'not_helpful')}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      review.userHasVoted === 'not_helpful'
                        ? 'text-red-400'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <HandThumbDownIcon className="w-4 h-4" />
                    <span>Not Helpful ({review.notHelpful})</span>
                  </button>
                </div>

                {review.recommended && (
                  <span className="text-green-400 text-sm font-medium">
                    ✓ Recommends this product
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}