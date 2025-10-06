'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const mockReviews: Review[] = [
  { id: '1', author: 'Rahul S.', rating: 5, date: '2024-01-10', comment: 'Amazing quality! The fit is perfect and the material feels premium.', verified: true },
  { id: '2', author: 'Priya M.', rating: 4, date: '2024-01-08', comment: 'Love the design! Slightly oversized but that\'s the style.', verified: true },
  { id: '3', author: 'Arjun K.', rating: 5, date: '2024-01-05', comment: 'Best streetwear brand in India! Fast delivery too.', verified: true },
];

export default function ReviewsSection({ productId }: { productId: string }) {
  const [reviews] = useState<Review[]>(mockReviews);
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} className={`w-5 h-5 ${star <= avgRating ? 'text-yellow-400' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-white font-semibold">{avgRating.toFixed(1)}</span>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold">
          Write Review
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
