import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PromoCodeForm from '../components/PromoCodeForm';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePromo } from '../context/PromoContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { deliveryService, STORE_LOCATION } from '../services/deliveryService';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../config/store';
import { formatPrice } from '../utils/currency';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { appliedPromo, getTotals, clearPromo } = usePromo();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState('delivery');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const { discount, tax, deliveryFee, total } = getTotals(subtotal, fulfillmentType);
  const deliveryHint = deliveryService.getDeliveryLabel(subtotal, fulfillmentType);
  const isDelivery = fulfillmentType === 'delivery';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isDelivery && (!form.address || !form.city || !form.zip)) {
      setError('Please enter your full delivery address.');
      return;
    }

    if (appliedPromo && discount <= 0) {
      setError('Your promo code is not valid for this order. Please remove it or try another code.');
      return;
    }

    setLoading(true);

    try {
      await paymentService.processPayment({
        cardNumber: form.cardNumber,
        expiry: form.expiry,
        cvv: form.cvv,
        amount: total,
      });

      const order = orderService.createOrder(user.id, items, {
        shippingAddress: {
          fullName: form.fullName,
          email: form.email,
          address: isDelivery ? form.address : STORE_LOCATION.address,
          city: isDelivery ? form.city : STORE_LOCATION.city,
          zip: isDelivery ? form.zip : STORE_LOCATION.zip,
        },
        paymentMethod: 'card',
        fulfillmentType,
        subtotal,
        tax,
        deliveryFee,
        discount,
        promoCode: appliedPromo?.code || null,
        total,
      });

      clearCart();
      clearPromo();
      navigate(`/orders/${order.id}`, { state: { justPlaced: true, showReceipt: true, receiptType: 'confirmation' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Nothing to checkout</h2>
          <Link to="/products" className="btn btn--primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="form-section">
              <h2>Fulfillment Method</h2>
              <div className="fulfillment-options">
                <label className={`fulfillment-option ${isDelivery ? 'fulfillment-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value="delivery"
                    checked={fulfillmentType === 'delivery'}
                    onChange={() => setFulfillmentType('delivery')}
                  />
                  <span className="fulfillment-icon">🚚</span>
                  <span className="fulfillment-label">
                    <strong>Delivery</strong>
                    <small>
                      {subtotal >= FREE_DELIVERY_THRESHOLD
                        ? `Free on orders ${formatPrice(FREE_DELIVERY_THRESHOLD)}+`
                        : `${formatPrice(DELIVERY_FEE)} fee (free over ${formatPrice(FREE_DELIVERY_THRESHOLD)})`}
                    </small>
                  </span>
                </label>
                <label className={`fulfillment-option ${!isDelivery ? 'fulfillment-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value="pickup"
                    checked={fulfillmentType === 'pickup'}
                    onChange={() => setFulfillmentType('pickup')}
                  />
                  <span className="fulfillment-icon">🏪</span>
                  <span className="fulfillment-label">
                    <strong>Store Pickup</strong>
                    <small>Free — pick up at our store</small>
                  </span>
                </label>
              </div>
              {isDelivery && deliveryHint && (
                <p className={`fulfillment-hint ${deliveryFee === 0 ? 'fulfillment-hint--free' : ''}`}>
                  {deliveryHint}
                </p>
              )}
              {!isDelivery && (
                <div className="pickup-info">
                  <p><strong>{STORE_LOCATION.name}</strong></p>
                  <p>{STORE_LOCATION.address}</p>
                  <p>{STORE_LOCATION.city} ({STORE_LOCATION.zip})</p>
                  <p>{STORE_LOCATION.country}</p>
                  <p className="pickup-hours">{STORE_LOCATION.hours}</p>
                </div>
              )}
            </section>

            <section className="form-section">
              <h2>{isDelivery ? 'Delivery Information' : 'Contact Information'}</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                {isDelivery && (
                  <>
                    <div className="form-group form-group--full">
                      <label htmlFor="address">Address</label>
                      <input id="address" name="address" value={form.address} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input id="city" name="city" value={form.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zip">CAP</label>
                      <input id="zip" name="zip" value={form.zip} onChange={handleChange} required />
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="form-section">
              <h2>Payment</h2>
              <div className="form-grid">
                <div className="form-group form-group--full">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="expiry">Expiry (MM/YY)</label>
                  <input id="expiry" name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input id="cvv" name="cvv" placeholder="123" value={form.cvv} onChange={handleChange} required />
                </div>
              </div>
            </section>

            {error && <div className="alert alert--error">{error}</div>}

            <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
              {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>
          </form>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <PromoCodeForm idPrefix="checkout-promo" />
            {items.map((item) => (
              <div key={item.product.id} className="checkout-item">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && (
              <div className="summary-row summary-row--discount">
                <span>Promo ({appliedPromo?.code})</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery</span>
              <span>
                {isDelivery
                  ? deliveryFee === 0
                    ? 'Free'
                    : formatPrice(deliveryFee)
                  : 'Pickup (Free)'}
              </span>
            </div>
            <div className="summary-row"><span>Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="summary-row summary-row--total"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
