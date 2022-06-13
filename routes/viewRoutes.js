const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();

viewRouter.get('/', authController.isLoggedIn, viewController.getOverview);
viewRouter.get('/tour/:slug', authController.protect, viewController.getTour);
viewRouter.get(
  '/login',
  authController.isLoggedIn,
  viewController.getLoginForm
);
viewRouter.get('/me', authController.protect, viewController.getAccount);

module.exports = viewRouter;
