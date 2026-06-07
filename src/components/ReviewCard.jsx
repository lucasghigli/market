export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function StarRating({ rating }) {
  return (
    <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'review-star review-star--filled' : 'review-star'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewCard({ review, className = '' }) {
  return (
    <article className={`review-card ${className}`.trim()}>
      <StarRating rating={review.rating} />
      <p className="review-quote">&ldquo;{review.quote}&rdquo;</p>
      <footer className="review-footer">
        <span className="review-avatar" aria-hidden="true">{getInitials(review.name)}</span>
        <strong className="review-name">{review.name}</strong>
        <span className="review-role">{review.role}</span>
      </footer>
    </article>
  );
}
