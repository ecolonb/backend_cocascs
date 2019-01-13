//Mongoose ORM
const mongoose = require('mongoose');
const muv = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
// Definición del schema CollectionsPlayer
const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: [true, 'The email is reuquired!'],
    unique: true
  },
  role: {
    type: String,
    default: 'player',
    enum: {
      values: ['admin', 'player', 'spect'],
      message: '{VALUE} no es un role valido!'
    }
  },
  online: {
    type: Boolean,
    default: false
  },
  ref_area: {
    type: mongoose.Types.ObjectId,
    ref: 'Area',
    required: [true, 'The area is reuquired!']
  },
  confirmed_acount: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: true
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
// Intersertar JSON para borrar password!
PlayerSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.role;
  delete obj.confirmed_acount;
  delete obj.online;
  delete obj.created_at;
  return obj;
};

// plugin to validate unique data => mongoose unique validator
PlayerSchema.plugin(muv, {
  message: 'El valor: [{VALUE}] para el campo [{PATH}] debe ser único!'
});
// Se exporta el schema como model de mongoose
const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
