const Routes = require('express').Router();
//Web functions
const webFunctions = require('../controllers/web/functions');
//Default route
Routes.get('/', webFunctions.home);

module.exports = Routes;
