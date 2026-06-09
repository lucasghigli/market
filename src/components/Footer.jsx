import { Link } from 'react-router-dom';

import { STORE, STORE_ADDRESS_LINES } from '../config/store';



export default function Footer() {

  return (

    <footer className="footer">

      <div className="container footer-inner">

        <div className="footer-top">

          <div className="footer-brand">

            <h3 className="footer-title">🛒 FreshMart</h3>

            <p className="footer-text">

              Your neighborhood supermarket for fresh groceries, quality ingredients,

              and everyday essentials — delivered with care.

            </p>

          </div>



          <div className="footer-grid">

            <div className="footer-section">

              <h4 className="footer-heading">Shop</h4>

              <Link to="/products" className="footer-link">All Products</Link>

              <Link to="/products?featured=true" className="footer-link">Featured</Link>

              <Link to="/products?category=fruits" className="footer-link">Fruits</Link>

              <Link to="/products?category=dairy" className="footer-link">Dairy</Link>

            </div>



            <div className="footer-section">

              <h4 className="footer-heading">Account</h4>

              <Link to="/login" className="footer-link">Login</Link>

              <Link to="/register" className="footer-link">Register</Link>

              <Link to="/dashboard" className="footer-link">My Orders</Link>

              <Link to="/cart" className="footer-link">Cart</Link>

            </div>



            <div className="footer-section">

              <h4 className="footer-heading">Contact</h4>

              <Link to="/contact" className="footer-link">Contact Us</Link>

              {STORE_ADDRESS_LINES.map((line) => (

                <p key={line} className="footer-text">{line}</p>

              ))}

              <p className="footer-text">{STORE.email}</p>

              <p className="footer-text">{STORE.phone}</p>

            </div>

          </div>

        </div>



        <div className="footer-trust">

          <span>✓ Quality guaranteed</span>

          <span>✓ Secure checkout</span>

          <span>✓ Pickup & delivery</span>

        </div>

      </div>



      <div className="footer-bottom">

        <div className="container">

          <p className="footer-copyright">
            © 2025 FreshMart. All rights reserved by Lucas Ghigli.
          </p>

        </div>

      </div>

    </footer>

  );

}


