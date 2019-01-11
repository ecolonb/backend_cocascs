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

app.listen(process.env.PORT, () => {
  console.log('Server on http://localhost:' + process.env.PORT);
});
