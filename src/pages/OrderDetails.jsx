import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import OrderReceipt from '../components/OrderReceipt';
import { getImageSrc } from '../utils/imagePath';
import { formatPrice } from '../utils/currency';

const statusColors = {
  pending: 'status--pending',
  processing: 'status--processing',
  shipped: 'status--shipped',
  delivered: 'status--delivered',
  cancelled: 'status--cancelled',
};

export default function OrderDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef(null);
  const [order, setOrder] = useState(() => orderService.getOrderById(id));
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(
    location.state?.showReceipt || location.state?.justPlaced || false
  );
  const [receiptType, setReceiptType] = useState(
    location.state?.receiptType || 'confirmation'
  );

  useEffect(() => {
    if (location.state?.justPlaced || location.state?.showReceipt) {
      setShowReceipt(true);
      setReceiptType(location.state?.receiptType || 'confirmation');
      setTimeout(() => {
        receiptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [location.state]);

  if (!order) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Order not found</h2>
          <Link to="/dashboard" className="btn btn--primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin && order.userId !== user?.id) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Access denied</h2>
          <Link to="/dashboard" className="btn btn--primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const canCancel = !isAdmin && orderService.canCancelOrder(order);
  const cancelDeadline = orderService.getCancelDeadline(order);
  const activeReceiptType = order.status === 'cancelled' ? 'cancellation' : receiptType;

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setError('');
    setCancelling(true);
    try {
      const updated = orderService.cancelOrder(order.id, user.id);
      setOrder(updated);
      setReceiptType('cancellation');
      setShowReceipt(true);
      setTimeout(() => {
        receiptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="page order-details-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> / Order {order.id}
        </nav>

        {location.state?.justPlaced && (
          <div className="alert alert--success order-success-banner">
            Order placed successfully! Your receipt is ready below.
          </div>
        )}

        {order.status === 'cancelled' && showReceipt && (
          <div className="alert alert--error order-cancel-banner">
            Order cancelled. Your cancellation receipt is ready below.
          </div>
        )}

        <div className="order-header">
          <div>
            <h1 className="page-title">Order {order.id}</h1>
            <p className="page-subtitle">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.cancelledAt && (
              <p className="page-subtitle">
                Cancelled on {new Date(order.cancelledAt).toLocaleString()}
              </p>
            )}
          </div>
          <span className={`status status--lg ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>

        {canCancel && (
          <div className="cancel-order-banner">
            <div>
              <p>You can cancel this order until <strong>{cancelDeadline.toLocaleString()}</strong></p>
            </div>
            <button
              className="btn btn--danger btn--sm"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}

        {error && <div className="alert alert--error">{error}</div>}

        <div className="order-receipt-toggle no-print">
          <button
            className="btn btn--outline"
            onClick={() => setShowReceipt((prev) => !prev)}
          >
            {showReceipt ? 'Hide Receipt' : 'View Receipt'}
          </button>
        </div>

        {showReceipt && (
          <div ref={receiptRef} className="order-receipt-section">
            <OrderReceipt order={order} type={activeReceiptType} />
          </div>
        )}

        <div className="order-layout">
          <section className="order-items-section">
            <h2>Items</h2>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.productId} className="order-item">
                  <img src={getImageSrc(item.image)} alt={item.name} />
                  <div className="order-item-info">
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <span className="order-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-price-breakdown">
              {order.subtotal != null && (
                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              )}
              {order.deliveryFee != null && (
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span>
                </div>
              )}
              {order.tax != null && (
                <div className="summary-row"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
              )}
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </section>

          <section className="order-shipping-section">
            <h2>{order.fulfillmentType === 'pickup' ? 'Store Pickup' : 'Delivery'}</h2>
            <p className="fulfillment-badge">
              {order.fulfillmentType === 'pickup' ? '🏪 Pick up at store' : '🚚 Home delivery'}
            </p>
            <div className="shipping-info">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.email}</p>
              {order.fulfillmentType === 'pickup' ? (
                <p>Pickup location: {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
              ) : (
                <>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                </>
              )}
            </div>
            <h2>Payment</h2>
            <p>Method: {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}</p>
            <button className="btn btn--outline btn--full" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
