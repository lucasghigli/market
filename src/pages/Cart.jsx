import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../config/store';
import { formatPrice } from '../utils/currency';

export default function Cart() {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="btn btn--primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
          <button className="btn btn--outline btn--sm" onClick={clearCart}>Clear Cart</button>
        </div>

        {subtotal >= FREE_DELIVERY_THRESHOLD ? (
          <div className="delivery-banner delivery-banner--free">
            🎉 You qualify for <strong>free delivery</strong> on this order!
          </div>
        ) : (
          <div className="delivery-banner">
            Add <strong>{formatPrice(amountToFreeDelivery)}</strong> more for free delivery (orders {formatPrice(FREE_DELIVERY_THRESHOLD)}+)
          </div>
        )}

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <p className="cart-delivery-note">
              Delivery fee ({formatPrice(DELIVERY_FEE)}) or free store pickup — choose at checkout
            </p>
            <div className="summary-row summary-row--total">
              <span>Estimated Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn--primary btn--full">Proceed to Checkout</Link>
            <Link to="/products" className="btn btn--outline btn--full">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
