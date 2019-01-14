const bodyParser = require('body-parser');
const express = require('express');
const app = new express();
// mongoose import
const mongoose = require('mongoose');

require('./server/config/config');
// app.use(express.static('public'));
app.set('view engine', 'hbs');
//app.use('/web', express.static('public'));
app.use('/web', express.static('public'));
const routesApi = require('./routes/api');
const routesWeb = require('./routes/web');
// like to BodyParser
// app.use(express.urlencoded({ extended: true })); esto no me funciono en una peticion POST mejor utilizo el BodyParser
// Body parser -> Parsear a json formularios de entrada
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//Routes web
app.use('/', routesWeb);
// Routes api
app.use('/api', routesApi);
app.get('*', function(req, res) {
  res.redirect('https://www.copiloto.com.mx/');
});
// Connect to dataBase
// mongodb://mongo_user:root123@ds255364.mlab.com:55364/cocascs
// mongodb://mongo_user:root123@ds153978.mlab.com:53978/mongo_test
mongoose.connect(
  'mongodb://mongo_cocas:root123@ds255364.mlab.com:55364/cocascs',
  (err, res) => {
    if (err) throw err;
    console.log('Datase => OK');
  }
);

app.listen(process.env.PORT, () => {
  console.log('Server on http://localhost:' + process.env.PORT);
});
