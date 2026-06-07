import { useEffect } from 'react';
import { reviews } from '../data/reviews';
import ReviewCard from './ReviewCard';

export default function ReviewsModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="reviews-modal" role="dialog" aria-modal="true" aria-labelledby="reviews-modal-title">
      <button type="button" className="reviews-modal-backdrop" onClick={onClose} aria-label="Close reviews" />
      <div className="reviews-modal-panel">
        <header className="reviews-modal-header">
          <div className="reviews-modal-header-text">
            <span className="section-eyebrow">Community</span>
            <h2 id="reviews-modal-title" className="reviews-modal-title">Customer Reviews</h2>
            <p className="reviews-modal-subtitle">
              {reviews.length} reviews · {averageRating} average rating
            </p>
          </div>
          <button type="button" className="reviews-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="reviews-modal-body">
          <div className="reviews-modal-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.name} review={review} className="review-card--modal" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
