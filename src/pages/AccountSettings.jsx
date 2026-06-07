import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function AccountSettings() {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const profile = authService.getUserById(user.id);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      updateProfile(form);
      setSuccess('Your account details have been saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account? This cannot be undone.'
    );
    if (!confirmed) return;

    const doubleCheck = window.prompt('Type DELETE to confirm account deletion:');
    if (doubleCheck !== 'DELETE') return;

    deleteAccount();
    navigate('/');
  };

  return (
    <div className="page account-page">
      <div className="container">
        <div className="page-header">
          <div>
            <nav className="breadcrumb">
              <Link to="/dashboard">Dashboard</Link> / My Account
            </nav>
            <h1 className="page-title">My Account</h1>
            <p className="page-subtitle">Manage your profile and account settings</p>
          </div>
        </div>

        <div className="account-layout">
          <section className="account-card">
            <h2>Profile Information</h2>
            <p className="account-card-desc">
              Your details are saved automatically when you click Save Changes.
            </p>

            <form onSubmit={handleSave} className="account-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+39 02 1234 5678"
                />
              </div>

              {success && <div className="alert alert--success">{success}</div>}
              {error && <div className="alert alert--error">{error}</div>}

              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>

          <aside className="account-sidebar">
            <div className="account-card">
              <h2>Account Summary</h2>
              <dl className="account-meta">
                <div>
                  <dt>Member since</dt>
                  <dd>{new Date(profile.createdAt).toLocaleDateString()}</dd>
                </div>
                {profile.updatedAt && (
                  <div>
                    <dt>Last updated</dt>
                    <dd>{new Date(profile.updatedAt).toLocaleDateString()}</dd>
                  </div>
                )}
                <div>
                  <dt>Role</dt>
                  <dd className="account-role">{user.role}</dd>
                </div>
              </dl>
              <Link to="/dashboard" className="btn btn--outline btn--full">
                View My Orders
              </Link>
            </div>

            <div className="account-card account-card--actions">
              <h2>Account Actions</h2>
              <p className="account-card-desc">
                Sign out anytime. Your information stays saved until you delete your account.
              </p>
              <button className="btn btn--outline btn--full" onClick={handleLogout}>
                Log Out
              </button>
              <button className="btn btn--danger btn--full" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
