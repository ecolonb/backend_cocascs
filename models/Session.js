//Mongoose ORM
const mongoose = require('mongoose');
const muv = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
// Definición del schema CollectionsPlayer
const SessionSchema = new Schema({
  ref_player: {
    type: mongoose.Types.ObjectId,
    ref: 'Player',
    required: [true, 'Player is required!']
  },
  user: {
    type: String,
    required: [true, 'The username is reuquired!'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'The email is reuquired!']
  },
  token: {
    type: String
  },
  last_connection: {
    type: Date,
    default: new Date()
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
// Intersentando el metodo toJson
SessionSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

// plugin to validate unique data => mongoose unique validator
SessionSchema.plugin(muv, {
  message: 'El valor: [{VALUE}] para el campo [{PATH}] debe ser único!'
});
// Se exporta el schema como model de mongoose
const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;
