'use client';

import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';

interface Review {
  id: number;
  product_id: number;
  rating: number;
  name: string;
  review: string;
  date_created: string;
  verified: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-500' : 'text-gray-300'
          }`}
          fill={star <= rating ? '#f59e0b' : 'none'}
        />
      ))}
    </div>
  );
};

export default function AvisClient({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les avis');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-8">
      <div className="flex justify-between items-center mb-6">
        {reviews.length > 0 && (
          <div className="flex items-center space-x-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} avis)
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          Aucun avis pour ce produit pour le moment.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b pb-4 last:border-b-0"
            >
              <div className="flex items-center mb-2">
                <User className="w-6 h-6 mr-2 text-gray-500" />
                <div>
                  <p className="font-medium">{review.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.date_created)}
                  </p>
                </div>
              </div>

              <StarRating rating={review.rating} />

              <p className="mt-2 text-gray-700">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
