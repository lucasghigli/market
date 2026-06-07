export default function ProductOrigin({ origin, compact = false }) {
  return (
    <p className={`product-origin${compact ? ' product-origin--compact' : ''}`}>
      <span className="product-origin-label">Country of origin</span>
      <span className="product-origin-value">{origin}</span>
    </p>
  );
}
