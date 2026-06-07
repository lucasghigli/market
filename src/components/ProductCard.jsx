import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageSrc } from '../utils/imagePath';
import ProductOrigin from './ProductOrigin';
import { formatPrice } from '../utils/currency';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-media">
        {product.featured && <span className="badge badge--featured">Featured</span>}
        <div className="product-card-image">
          <img src={getImageSrc(product.image)} alt={product.name} loading="lazy" />
        </div>
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-meta">
          <span className="product-card-rating">⭐ {product.rating.toFixed(1)}</span>
          {product.stock > 0 && <span className="product-card-stock">In stock</span>}
        </div>
        <ProductOrigin origin={product.origin} compact />
        <div className="product-card-footer">
          <span className="product-card-price">
            {formatPrice(product.price)}
            <small>/{product.unit}</small>
          </span>
          <button className="btn btn--primary btn--sm" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
