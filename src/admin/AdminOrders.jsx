import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { orderService } from '../services/orderService';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState(orderService.getAllOrders());

  const refresh = () => setOrders(orderService.getAllOrders());

  const handleStatusChange = (id, status) => {
    orderService.updateOrderStatus(id, status);
    refresh();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this order?')) {
      orderService.deleteOrder(id);
      refresh();
    }
  };

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="page-header">
          <div>
            <nav className="breadcrumb"><Link to="/admin">Admin</Link> / Orders</nav>
            <h1 className="page-title">Manage Orders</h1>
          </div>
        </div>

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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items.length}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="select select--sm"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="table-actions">
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(order.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
