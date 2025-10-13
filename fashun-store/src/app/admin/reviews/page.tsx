'use client';

import { useEffect, useState } from 'react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const mockReviews: Review[] = [
      {
        id: '1',
        productId: 'p1',
        productName: 'Oversized Graphic Tee',
        userName: 'John Doe',
        rating: 5,
        comment: 'Amazing quality! Love the fit.',
        status: 'pending',
        createdAt: '2025-01-20',
      },
      {
        id: '2',
        productId: 'p2',
        productName: 'Cargo Pants',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Good product but sizing runs small.',
        status: 'pending',
        createdAt: '2025-01-19',
      },
    ];
    setReviews(mockReviews);
  };

  const handleApprove = async (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = async (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Reviews</h1>
          <a href="/admin" className="text-purple-600 hover:underline">← Back to Dashboard</a>
        </div>

        <div className="flex gap-4 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{review.productName}</h3>
                  <p className="text-gray-600">by {review.userName}</p>
                  <p className="text-sm text-gray-500">{review.createdAt}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              <div className="flex gap-3">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {review.status === 'approved' && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">✓ Approved</span>
                )}
                {review.status === 'rejected' && (
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg">✗ Rejected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
