import { createContext, useContext, useState, useCallback } from 'react';
import ReviewsModal from '../components/ReviewsModal';

const ReviewsModalContext = createContext(null);

export function ReviewsModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openReviews = useCallback(() => setIsOpen(true), []);
  const closeReviews = useCallback(() => setIsOpen(false), []);

  return (
    <ReviewsModalContext.Provider value={{ isOpen, openReviews, closeReviews }}>
      {children}
      {isOpen && <ReviewsModal onClose={closeReviews} />}
    </ReviewsModalContext.Provider>
  );
}

export function useReviewsModal() {
  const context = useContext(ReviewsModalContext);
  if (!context) {
    throw new Error('useReviewsModal must be used within ReviewsModalProvider');
  }
  return context;
}
