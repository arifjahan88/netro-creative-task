//Create a middleware function that wraps an async function and calls next with any errors that occur
exports.asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
