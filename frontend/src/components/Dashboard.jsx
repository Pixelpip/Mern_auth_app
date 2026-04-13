
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getItems, createItem, updateItem, deleteItem, getStats } from '../api/itemApi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [formData, setFormData] = useState({ title: '', description: '', status: 'active' });
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);


  const [deleteConfirm, setDeleteConfirm] = useState(null);


  const fetchData = async () => {
    try {
      const [itemsRes, statsRes] = await Promise.all([getItems(), getStats()]);
      setItems(itemsRes.data.items);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    setFormLoading(true);
    try {
      if (editingId) {
        await updateItem(editingId, formData);
        setSuccess('Item updated successfully');
        setEditingId(null);
      } else {
        await createItem(formData);
        setSuccess('Item created successfully');
      }
      setFormData({ title: '', description: '', status: 'active' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };


  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      status: item.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', status: 'active' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setSuccess('Item deleted successfully');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };


  const handleStatusChange = async (id, newStatus) => {
    try {
      const item = items.find((i) => i.id === id);
      await updateItem(id, { ...item, status: newStatus });
      fetchData();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-100">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-1.5 rounded text-sm hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4">
        
        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/15 border border-green-500/30 text-green-300 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-100">{stats.total}</p>
            <p className="text-gray-400 text-sm">Total Items</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-gray-400 text-sm">Active</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-gray-400 text-sm">Pending</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
            <p className="text-gray-400 text-sm">Completed</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">
            {editingId ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="title">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
                  placeholder="Item title"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="description">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
                  placeholder="Item description"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="active" className="bg-gray-800">Active</option>
                  <option value="pending" className="bg-gray-800">Pending</option>
                  <option value="completed" className="bg-gray-800">Completed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 transition-all duration-200"
              >
                {formLoading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-white/10 border border-white/15 text-gray-300 px-6 py-2 rounded hover:bg-white/15 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
          <h2 className="text-lg font-semibold p-4 border-b border-white/10 text-gray-100">Your Items</h2>
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items yet. Add your first item above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Title</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Description</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Created</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-white/5 hover:bg-white/5 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm text-gray-200">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {item.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded border ${
                            item.status === 'active'
                              ? 'bg-green-500/15 text-green-300 border-green-500/30'
                              : item.status === 'pending'
                              ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          <option value="active" className="bg-gray-800">Active</option>
                          <option value="pending" className="bg-gray-800">Pending</option>
                          <option value="completed" className="bg-gray-800">Completed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-teal-400 hover:text-teal-300 text-sm transition-colors duration-150"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="text-rose-400 hover:text-rose-300 text-sm transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

  
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-100">Confirm Delete</h3>
            <p className="text-gray-400 mb-4">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-white/10 border border-white/15 text-gray-300 px-4 py-2 rounded hover:bg-white/15 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-2 rounded hover:from-rose-500 hover:to-rose-600 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
