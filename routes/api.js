const Routes = require('express').Router();
const userController = require('../controllers/api/users/functions');
Routes.get('/newuser', userController.newUser);

module.exports = Routes;
