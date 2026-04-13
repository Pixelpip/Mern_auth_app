import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Login</h1>

        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm text-gray-400">
              <input type="checkbox" className="mr-2 accent-amber-500" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-400 hover:text-teal-300 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
