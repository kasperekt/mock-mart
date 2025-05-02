import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  name: string;
}

interface RatingProps {
  productId: number;
  initialRating: number;
  ratingCount: number;
  onRatingChange?: (newRating: number, newCount: number) => void;
}

export function Rating({ 
  productId, 
  initialRating, 
  ratingCount, 
  onRatingChange,
}: RatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(ratingCount);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // If user is logged in, check if they've already rated this product
          if (data.user) {
            const ratingResponse = await fetch(`/api/products/${productId}/user-rating`);
            if (ratingResponse.ok) {
              const ratingData = await ratingResponse.json();
              setUserRating(ratingData.rating);
            }
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [productId]);

  const handleRatingClick = async (selectedRating: number) => {
    if (!user) {
      setError('Please sign in to rate products');
      return;
    }
    
    if (userRating !== null) {
      setError('You have already rated this product');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/products/${productId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: selectedRating }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rating');
      }
      
      const data = await response.json();
      setRating(data.rating.rate);
      setCount(data.rating.count);
      setUserRating(selectedRating);
      setSuccess(true);
      
      if (onRatingChange) {
        onRatingChange(data.rating.rate, data.rating.count);
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center space-x-2">
      <div className="animate-pulse flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="animate-pulse w-20 h-5 bg-gray-200 rounded" />
    </div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <button
                key={`star-${productId}-${i}`}
                type="button"
                className={`w-5 h-5 focus:outline-none ${
                  user && userRating === null ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => handleRatingClick(ratingValue)}
                onMouseEnter={() => user && userRating === null && setHoveredRating(ratingValue)}
                onMouseLeave={() => user && userRating === null && setHoveredRating(0)}
                disabled={!user || userRating !== null || isSubmitting}
              >
                <svg
                  className={`w-5 h-5 ${
                    ratingValue <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            );
          })}
        </div>
        <span className="text-sm text-gray-500 ml-2">
          {rating.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      </div>
      
      <div className="mt-2">
        {isSubmitting && (
          <p className="text-sm text-gray-500">Submitting your rating...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-500">Thank you for your rating!</p>
        )}
        {!user && !error && (
          <p className="text-sm text-gray-500">Sign in to rate this product</p>
        )}
        {user && userRating !== null && !error && (
          <p className="text-sm text-gray-500">You rated this product {userRating} stars</p>
        )}
      </div>
    </div>
  );
} 