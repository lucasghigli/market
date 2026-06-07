import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { getImageSrc } from '../utils/imagePath';
import ProductOrigin from '../components/ProductOrigin';
import { formatPrice } from '../utils/currency';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = productService.getProductById(id);

  if (!product) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn--primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  const category = productService.getCategoryById(product.category);
  const related = productService
    .getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="page product-details-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.name}
        </nav>

        <div className="product-details">
          <div className="product-details-media">
            {product.featured && <span className="badge badge--featured">Featured</span>}
            <div className="product-details-image">
              <img src={getImageSrc(product.image)} alt={product.name} />
            </div>
          </div>
          <div className="product-details-info">
            <div className="product-details-summary">
              <span className="badge">{category?.icon} {category?.name}</span>
              <h1 className="product-details-title">{product.name}</h1>
              <div className="product-rating">⭐ {product.rating} / 5.0</div>
              <p className="product-details-desc">{product.description}</p>
              <ProductOrigin origin={product.origin} />
              <div className="product-details-price">
                <span className="price">{formatPrice(product.price)}</span>
                <span className="unit">per {product.unit}</span>
              </div>
              <p className="stock-info">
                {product.stock > 0 ? (
                  <span className="in-stock">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </p>
            </div>

            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">−</button>
                <span className="qty-value">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
              </div>
              <button
                className="btn btn--primary btn--lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">Related Products</h2>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
