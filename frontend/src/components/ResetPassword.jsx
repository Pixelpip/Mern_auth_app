
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/authApi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ token, ...formData });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Reset Password</h1>

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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          <Link to="/login" className="text-teal-400 hover:text-teal-300 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
