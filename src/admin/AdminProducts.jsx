import { useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { getImageSrc } from '../utils/imagePath';
import { formatPrice } from '../utils/currency';

const emptyProduct = {
  name: '',
  category: 'fruits',
  origin: '',
  price: '',
  unit: '',
  image: '',
  description: '',
  stock: '',
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState(productService.getAllProducts());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const categories = productService.getAllCategories();

  const refresh = () => setProducts(productService.getAllProducts());

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ ...product, price: String(product.price), stock: String(product.stock) });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      productService.deleteProduct(id);
      refresh();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };

    if (editingId) {
      productService.updateProduct(editingId, data);
    } else {
      productService.addProduct(data);
    }

    setForm(emptyProduct);
    setEditingId(null);
    setShowForm(false);
    refresh();
  };

  const handleCancel = () => {
    setForm(emptyProduct);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="page-header">
          <div>
            <nav className="breadcrumb"><Link to="/admin">Admin</Link> / Products</nav>
            <h1 className="page-title">Manage Products</h1>
          </div>
          <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyProduct); }}>
            + Add Product
          </button>
        </div>

        {showForm && (
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Product' : 'New Product'}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="select">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <input name="unit" value={form.unit} onChange={handleChange} placeholder="lb, pack, etc." required />
              </div>
              <div className="form-group">
                <label>Country of Origin</label>
                <input name="origin" value={form.origin} onChange={handleChange} placeholder="e.g. United States" required />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} required />
              </div>
              <div className="form-group form-group--full">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" required />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  Featured product
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn btn--outline" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        )}

        <div className="orders-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Origin</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td><img src={getImageSrc(product.image)} alt={product.name} className="table-thumb" /></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.origin || '—'}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>{product.featured ? '✓' : '—'}</td>
                  <td className="table-actions">
                    <button className="btn btn--outline btn--sm" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
