import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const statusColors = {
  pending: 'status--pending',
  processing: 'status--processing',
  shipped: 'status--shipped',
  delivered: 'status--delivered',
  cancelled: 'status--cancelled',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(() => orderService.getOrdersByUser(user.id));
  const [cancellingId, setCancellingId] = useState(null);

  const refresh = () => setOrders(orderService.getOrdersByUser(user.id));

  const handleCancel = (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      orderService.cancelOrder(orderId, user.id);
      refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'cancelled');

  return (
    <div className="page dashboard-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user.name}!</p>
          </div>
          <Link to="/account" className="btn btn--outline btn--sm">Edit Account</Link>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">{activeOrders.length}</span>
            <span className="stat-label">Active Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {formatPrice(activeOrders.reduce((sum, o) => sum + o.total, 0))}
            </span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>

        <section className="dashboard-section">
          <h2 className="section-title">Order History</h2>
          {orders.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const canCancel = orderService.canCancelOrder(order);
                    return (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.items.length} items</td>
                        <td>{formatPrice(order.total)}</td>
                        <td>
                          <span className={`status ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="table-actions">
                          <Link to={`/orders/${order.id}`} className="btn btn--outline btn--sm">
                            View
                          </Link>
                          {canCancel && (
                            <button
                              className="btn btn--danger btn--sm"
                              onClick={() => handleCancel(order.id)}
                              disabled={cancellingId === order.id}
                            >
                              {cancellingId === order.id ? '...' : 'Cancel'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't placed any orders yet.</p>
              <Link to="/products" className="btn btn--primary">Start Shopping</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
