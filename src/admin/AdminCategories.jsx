import { useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';

const emptyCategory = { id: '', name: '', description: '', image: '', icon: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState(productService.getAllCategories());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCategory);

  const refresh = () => setCategories(productService.getAllCategories());

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({ ...category });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const products = productService.getProductsByCategory(id);
    if (products.length > 0) {
      alert(`Cannot delete: ${products.length} products use this category.`);
      return;
    }
    if (window.confirm('Delete this category?')) {
      productService.deleteCategory(id);
      refresh();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      productService.updateCategory(editingId, form);
    } else {
      productService.addCategory(form);
    }
    setForm(emptyCategory);
    setEditingId(null);
    setShowForm(false);
    refresh();
  };

  const handleCancel = () => {
    setForm(emptyCategory);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="page-header">
          <div>
            <nav className="breadcrumb"><Link to="/admin">Admin</Link> / Categories</nav>
            <h1 className="page-title">Manage Categories</h1>
          </div>
          <button className="btn btn--primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyCategory); }}>
            + Add Category
          </button>
        </div>

        {showForm && (
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Category' : 'New Category'}</h3>
            <div className="form-grid">
              {!editingId && (
                <div className="form-group">
                  <label>ID (slug)</label>
                  <input name="id" value={form.id} onChange={handleChange} placeholder="e.g. frozen" required />
                </div>
              )}
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Icon (emoji)</label>
                <input name="icon" value={form.icon} onChange={handleChange} placeholder="🧊" required />
              </div>
              <div className="form-group form-group--full">
                <label>Description</label>
                <input name="description" value={form.description} onChange={handleChange} required />
              </div>
              <div className="form-group form-group--full">
                <label>Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} required />
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
                <th>Icon</th>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="category-icon-cell">{cat.icon}</td>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td className="table-actions">
                    <button className="btn btn--outline btn--sm" onClick={() => handleEdit(cat)}>Edit</button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(cat.id)}>Delete</button>
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
