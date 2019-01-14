const path = require('path');
const Confirmation = require('../../models/Confirmation');
const Player = require('../../models/Player');
module.exports = {
  home: (req, res) => {
    return res.send('¡Hello cocas!');
  },
  activateAcount: async (req, res) => {
    //Hash
    const hash = req.query.target;
    // Redireccionando al formulario para activar la cuenta
    // res.sendFile(path.join(__dirname, '../../public', 'active_acount.html'));
    // return res.sendFile(
    //   path.join(__dirname, '../../views', 'active_acount.html')
    // );
    //Obtener los datos del usuario:
    const confirmationPopulate = await Confirmation.find({ hash }).populate(
      'player'
    );
    if (confirmationPopulate.length <= 0) {
      // return res.render('active_acount', dataToView);
      return res.redirect('https://www.copiloto.com.mx');
    }
    const confirmationSrc = await Confirmation.findOne({ hash });
    confirmationSrc.status = false;
    await confirmationSrc.save();
    const conf = confirmationPopulate[0];
    const player = await Player.findById(conf.player._id);
    player.confirmed_acount = true;
    await player.save();
    const dataToView = {
      name: conf.player.name + ' ' + conf.player.lastname,
      title:
        'Cocas => Activate acount ' +
        conf.player.name +
        ' ' +
        conf.player.lastname +
        ' <' +
        conf.player.email +
        '>'
    };
    return res.render('active_acount', dataToView);
  }
};
