const express = require('express');
const app = new express();
// mongoose import
const mongoose = require('mongoose');

require('./server/config/config');
const routesApi = require('./routes/api');
const routesWeb = require('./routes/web');
// like to BodyParser
app.use(express.urlencoded({ extended: true }));

//Routes web
app.use('/', routesWeb);
// Routes api
app.use('/api', routesApi);

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
