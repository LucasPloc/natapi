const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('No tour with that name!', 404));
  }
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour,
  });
});
const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

module.exports = { getOverview, getTour, getLoginForm, getAccount };
