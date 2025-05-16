const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

 
  console.log(err);

  
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered for ${field}`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Not authorized';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ErrorResponse(message, 401);
  }

  // Custom error from controllers
  if (err.name === 'ErrorResponse') {
    error = err;
  }

  // Format response according to assignment requirements
  res.status(error.statusCode || 500).json({
    status: false,
    errors: [{
      message: error.message || 'Server Error',
      code: error.code || 'SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }]
  });
};

module.exports = errorHandler;