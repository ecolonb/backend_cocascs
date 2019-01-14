const Routes = require('express').Router();
//Web functions
const webFunctions = require('../controllers/web/functions');
//Default route
Routes.get('/', webFunctions.home)
  // Activación de la cuenta
  .get('/activate_acount', webFunctions.activateAcount);
module.exports = Routes;
