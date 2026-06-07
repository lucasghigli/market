import { reviews } from '../data/reviews';
import ReviewCard from './ReviewCard';

function ReviewGroup({ ariaHidden = false }) {
  return (
    <div className="reviews-marquee-group" aria-hidden={ariaHidden || undefined}>
      {reviews.map((review) => (
        <ReviewCard key={`${ariaHidden ? 'copy-' : ''}${review.name}`} review={review} />
      ))}
    </div>
  );
}

export default function ReviewsMarquee() {
  return (
    <div className="reviews-marquee" role="region" aria-label="Customer reviews preview">
      <div className="reviews-marquee-viewport">
        <div className="reviews-marquee-track">
          <ReviewGroup />
          <ReviewGroup ariaHidden />
        </div>
      </div>
    </div>
  );
}
