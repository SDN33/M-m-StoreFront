import React, { useEffect, useState } from 'react';

interface Review {
  id: number;
  product_id: number;
  author: string;
  rating: number;
  date_created: string;
  review: string;
}

interface ProductReviewsProps {
  productId: string; // L'ID du produit dont on veut afficher les avis
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les avis du produit
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?id=${productId}`);
        const data = await response.json();

        // Si on reçoit des avis, on les met dans l'état
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setError('Aucune critique trouvée.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Afficher un message de chargement
  if (loading) return <div>Chargement des avis...</div>;

  // Afficher un message d'erreur
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Afficher les avis
  return (
    <div>
      {reviews.length === 0 ? (
        <p className='text-center'>Aucun avis pour ce produit.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                {review.author} - <span>{review.rating} / 5</span>
              </div>
              <div style={{ marginBottom: '5px', color: 'gray' }}>
                {new Date(review.date_created).toLocaleDateString()}
              </div>
              <p>{review.review}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductReviews;
