import { useCart } from '../context/CartContext';
import { getImageSrc } from '../utils/imagePath';
import { formatPrice } from '../utils/currency';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="cart-item">
      <img src={getImageSrc(product.image)} alt={product.name} className="cart-item-image" />
      <div className="cart-item-info">
        <h3 className="cart-item-name">{product.name}</h3>
        <p className="cart-item-price">{formatPrice(product.price)} / {product.unit}</p>
      </div>
      <div className="cart-item-quantity">
        <button
          className="qty-btn"
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="qty-value">{quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateQuantity(product.id, quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="cart-item-total">{formatPrice(lineTotal)}</div>
      <button
        className="cart-item-remove"
        onClick={() => removeFromCart(product.id)}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
