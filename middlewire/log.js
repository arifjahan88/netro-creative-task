const logger = require("../utils/logger");

const logMiddleware = (req, res, next) => {
  // Save the original res.send method
  const originalSend = res.send;

  // Override res.send to log response data
  res.send = function (body) {
    logger.info({
      status: res.statusCode,
      body,
      method: req.method,
      path: req.path,
      ip: req.ip, // IP address of the client
      userAgent: req.get("User-Agent"), // User-Agent header
      params: req.params,
      query: req.query,
    });

    originalSend.call(this, body);
  };

  // Log errors
  const originalError = res.error;
  res.error = function (error) {
    logger.error({
      error: error.message,
      stack: error.stack,
      method: req.method,
      path: req.path,
      ip: req.ip, // IP address of the client
      userAgent: req.get("User-Agent"), // User-Agent header
      params: req.params,
      query: req.query,
    });

    originalError.call(this, error);
  };

  // Log warnings
  const originalWarning = res.warning;
  res.warning = function (warning) {
    logger.warn({
      warning: warning.message,
      stack: warning.stack,
      method: req.method,
      path: req.path,
      ip: req.ip, // IP address of the client
      userAgent: req.get("User-Agent"), // User-Agent header
      params: req.params,
      query: req.query,
    });
    originalWarning.call(this, warning);
  };

  next();
};

module.exports = logMiddleware;
