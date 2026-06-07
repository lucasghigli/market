import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';

export default function AdminDashboard() {
  const products = productService.getAllProducts();
  const orders = orderService.getAllOrders();
  const users = authService.getAllUsers();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage your supermarket</p>
        </div>

        <div className="admin-stats">
          <div className="stat-card stat-card--primary">
            <span className="stat-value">{products.length}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-card stat-card--success">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat-card stat-card--warning">
            <span className="stat-value">{pendingOrders}</span>
            <span className="stat-label">Pending Orders</span>
          </div>
          <div className="stat-card stat-card--info">
            <span className="stat-value">{formatPrice(totalRevenue)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Users</span>
          </div>
        </div>

        <div className="admin-nav-grid">
          <Link to="/admin/products" className="admin-nav-card">
            <span className="admin-nav-icon">📦</span>
            <h3>Manage Products</h3>
            <p>Add, edit, or remove products</p>
          </Link>
          <Link to="/admin/orders" className="admin-nav-card">
            <span className="admin-nav-icon">📋</span>
            <h3>Manage Orders</h3>
            <p>View and update order status</p>
          </Link>
          <Link to="/admin/categories" className="admin-nav-card">
            <span className="admin-nav-icon">🏷️</span>
            <h3>Manage Categories</h3>
            <p>Organize product categories</p>
          </Link>
          <Link to="/admin/users" className="admin-nav-card">
            <span className="admin-nav-icon">👥</span>
            <h3>Manage Users</h3>
            <p>View and manage user accounts</p>
          </Link>
        </div>

        <section className="dashboard-section">
          <h2 className="section-title">Recent Orders</h2>
          {orders.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{formatPrice(order.total)}</td>
                      <td><span className={`status status--${order.status}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-text">No orders yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
