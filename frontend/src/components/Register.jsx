import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
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

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
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
      const res = await registerUser(formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Register</h1>

        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="name">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">
              Email *
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
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
