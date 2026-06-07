import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import SearchBar from './SearchBar';
import { useReviewsModal } from '../context/ReviewsModalContext';

export default function Header() {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const categories = productService.getAllCategories();
  const { openReviews } = useReviewsModal();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <NavLink to="/products" className="nav-link" onClick={closeMenu}>Products</NavLink>
      <NavLink to="/contact" className="nav-link" onClick={closeMenu}>Contact</NavLink>
      <button type="button" className="nav-link nav-link--button" onClick={() => { openReviews(); closeMenu(); }}>
        Reviews
      </button>
      {isAdmin && (
        <NavLink to="/admin" className="nav-link nav-link--admin" onClick={closeMenu}>Admin</NavLink>
      )}
    </>
  );

  const accountLinks = isAuthenticated ? (
    <>
      <Link to="/account" className="mobile-nav-item" onClick={closeMenu}>My Account</Link>
      <Link to="/dashboard" className="mobile-nav-item" onClick={closeMenu}>My Orders</Link>
      <Link to="/cart" className="mobile-nav-item" onClick={closeMenu}>Cart</Link>
      <button
        type="button"
        className="mobile-nav-item mobile-nav-item--button"
        onClick={() => { logout(); closeMenu(); }}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="mobile-nav-item" onClick={closeMenu}>Login</Link>
      <Link to="/register" className="mobile-nav-item" onClick={closeMenu}>Register</Link>
      <Link to="/dashboard" className="mobile-nav-item" onClick={closeMenu}>My Orders</Link>
      <Link to="/cart" className="mobile-nav-item" onClick={closeMenu}>Cart</Link>
    </>
  );

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">FreshMart</span>
        </Link>

        <div className="search-bar-desktop">
          <SearchBar />
        </div>

        <nav className="nav nav--desktop">{navLinks}</nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <span>🛍️</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          <div className="header-auth header-auth--desktop">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/account" className="user-name">{user.name}</Link>
                <button onClick={logout} className="btn btn--outline btn--sm">Logout</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn--outline btn--sm">Login</Link>
                <Link to="/register" className="btn btn--primary btn--sm">Register</Link>
              </div>
            )}
          </div>

          <button
            className={`menu-toggle ${menuOpen ? 'menu-toggle--open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="header-search-row container">
        <SearchBar />
      </div>

      <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}>
        <div className="mobile-nav-backdrop" onClick={closeMenu} />
        <div className="mobile-nav-panel">
          <div className="mobile-nav-welcome">
            <p className="mobile-nav-welcome-title">Welcome to our website!</p>
            <p className="mobile-nav-welcome-sub">Fresh groceries, delivered with care</p>
          </div>

          <nav className="mobile-nav-links">{navLinks}</nav>

          <div className="mobile-nav-section">
            <h4 className="mobile-nav-heading">Shop</h4>
            <div className="mobile-nav-items">
              <Link to="/products" className="mobile-nav-item" onClick={closeMenu}>All Products</Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="mobile-nav-item"
                  onClick={closeMenu}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mobile-nav-section">
            <h4 className="mobile-nav-heading">Account</h4>
            <div className="mobile-nav-items">{accountLinks}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
