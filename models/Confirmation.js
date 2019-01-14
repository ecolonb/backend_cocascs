const mongoose = require('mongoose');
const muv = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const ConfirmationSchema = new Schema({
  ref_participante: {
    type: mongoose.Types.ObjectId,
    ref: 'Player',
    unique: true
  },
  hash: { type: String, required: false },
  status: {
    type: Boolean,
    default: true,
    required: false
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

ConfirmationSchema.plugin(muv, {
  message: 'El valor: [{VALUE}] para el campo [{PATH}] debe ser único!'
});

const Confirmation = mongoose.model('Confirmation', ConfirmationSchema);
module.exports = Confirmation;
