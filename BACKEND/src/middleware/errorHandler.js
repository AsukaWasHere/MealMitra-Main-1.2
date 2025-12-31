// A centralized error handler middleware
const errorHandler = (err, req, res, next) => {
  // Default to 500 server error if status code is not set
  const statusCode = res.statusCode ? res.statusCode : 500;

  let message = err.message;
  let errors = err.errors || [];

  // Mongoose Bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    res.status(404);
    message = 'Resource not found';
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    res.status(400);
    message = 'Invalid input data';
    errors = Object.values(err.errors).map(item => item.message);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401);
    message = 'Not authorized, token failed';
  }
  
  if (err.name === 'TokenExpiredError') {
    res.status(401);
    message = 'Not authorized, token expired';
  }

  // Standardized error response
  res.status(statusCode).json({
    success: false,
    message: message,
    // Provide errors array only if it has content
    ...(errors.length > 0 && { errors: errors }),
  });
};

export default errorHandler;