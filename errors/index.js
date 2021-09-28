class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static PromocodeNotFoundErr = "promocode not found";
  static PromocodeNotRedeemed = "promocode not redeemed";
  static PromocodeTypeNotFoundErr = "promocode type not found";
  static CustomerNotFoundErr = "customer not found";
}

module.exports = ApiError;
