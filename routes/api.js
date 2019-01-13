//Importando el router de express
const Routes = require('express').Router();
//Importando el modulo de funciones disponibles para el usuario
const userController = require('../controllers/api/users/functions');
//Importando el modulo de funciones para Areas
const areaController = require('../controllers/api/area/functions');
// *** Rutas USUARIO ***, la función que procesa la peticiones está en => (controllers/api/users/functions.js)
// Agrega nuevo usuario
Routes.post('/newuser', userController.newUser)
  // Verifica el nombre de usuario disponible
  .get('/checkuser/:user', userController.checkUser)
  // Verifica email disponible
  .get('/checkemail/:email', userController.checkEmail)

  // *************  Rutas para admistrar las Areas
  //Agregar nueva AREA
  .post('/newarea', areaController.new_area)
  // Obtiene el listado de las areas
  .get('/getallarea', areaController.get_all_area);

//Se exportan las rutas de la api
module.exports = Routes;
