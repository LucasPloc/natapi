const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data, ${errors.join(', ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError(`Invalid token, please login again`, 401);
const handleTokenExpiredError = () =>
  new AppError(`Token expired, please login again`, 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  const msg = err.isOperational
    ? err.message
    : 'this is unexpected -- please contact support';
  !err.isOperational && console.error('error 🥵', err);

  if (req.originalUrl.match(/^[/]api[/]v/)) {
    res.status(err.statusCode).json({
      status: err.status,
      message: msg,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      status: err.status,
      message: msg,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    sendErrorProd(error, res);
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
  }
};
