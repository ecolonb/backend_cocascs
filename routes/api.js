//Importando el router de express
const Routes = require('express').Router();
//Importando el modulo de funciones disponibles para el usuario
const userController = require('../controllers/api/users/functions');
//Importando el modulo de funciones para Areas
const areaController = require('../controllers/api/area/functions');
// *** Rutas USUARIO ***, la función que procesa la peticiones está en => (controllers/api/users/functions.js)
//Procesa peticion post para un nuevo usuario
Routes.post('/newuser', userController.newUser);
//Verificar si el nombre de usuario existe
Routes.get('/checkuser/:user', userController.checkUser);
//Verificar si el email ya esta registrado
Routes.get('/checkemail/:email', userController.checkEmail);

//Functiones para admistrar las Areas
//Agregar nueva AREA
Routes.post('/newarea', areaController.new_area);
Routes.get('/getallarea', areaController.get_all_area);
//Se exportan las rutas de la api
module.exports = Routes;
