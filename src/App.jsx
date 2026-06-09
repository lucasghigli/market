import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PromoProvider } from './context/PromoContext';
import { ReviewsModalProvider } from './context/ReviewsModalContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AccountSettings from './pages/AccountSettings';
import OrderDetails from './pages/OrderDetails';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCategories from './admin/AdminCategories';
import AdminUsers from './admin/AdminUsers';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <PromoProvider>
          <ReviewsModalProvider>
          <div className="app">
            <Header />
            <main className="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><UserDashboard /></ProtectedRoute>
                } />
                <Route path="/account" element={
                  <ProtectedRoute><AccountSettings /></ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute><OrderDetails /></ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminRoute><AdminProducts /></AdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminRoute><AdminOrders /></AdminRoute>
                } />
                <Route path="/admin/categories" element={
                  <AdminRoute><AdminCategories /></AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute><AdminUsers /></AdminRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </ReviewsModalProvider>
          </PromoProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
