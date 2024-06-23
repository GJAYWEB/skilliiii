// Define error handling middleware function
function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the error stack trace

  // Set the HTTP status code based on the error
  const statusCode = err.statusCode || 500;

  // Send an error response to the client
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
}

module.exports = errorHandler;
