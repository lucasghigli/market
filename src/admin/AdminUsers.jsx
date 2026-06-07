import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState(authService.getAllUsers());
  const { user: currentUser } = useAuth();

  const refresh = () => setUsers(authService.getAllUsers());

  const handleRoleChange = (id, role) => {
    authService.updateUserRole(id, role);
    refresh();
  };

  const handleDelete = (id) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own account.');
      return;
    }
    if (window.confirm('Delete this user?')) {
      authService.deleteUser(id);
      refresh();
    }
  };

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="page-header">
          <div>
            <nav className="breadcrumb"><Link to="/admin">Admin</Link> / Users</nav>
            <h1 className="page-title">Manage Users</h1>
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="select select--sm"
                      disabled={u.id === currentUser.id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="table-actions">
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleDelete(u.id)}
                      disabled={u.id === currentUser.id}
                    >
                      Delete
                    </button>
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
