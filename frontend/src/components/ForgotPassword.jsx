import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Forgot Password</h1>

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
            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
