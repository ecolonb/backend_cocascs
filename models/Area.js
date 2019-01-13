const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const muv = require('mongoose-unique-validator');
const AreaSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The name of area is required!'],
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date,
    default: new Date()
  }
});

AreaSchema.plugin(muv, {
  message: 'El valor: [{VALUE}] para el campo [{PATH}] debe ser único!'
});
const Area = mongoose.model('Area', AreaSchema);
module.exports = Area;
