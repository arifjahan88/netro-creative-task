exports.createError = (status, message) => {
  const error = new Error();
  error.status = status;
  error.message = message;
  error.stack = undefined;
  return error;
};
