
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);


  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ message: 'Duplicate entry. This record already exists.' });
  }

  
  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json({ message: 'Database connection failed. Please try again later.' });
  }


  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }


  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
