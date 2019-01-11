const Player = require('../../../models/Player');
module.exports = {
  newUser: (req, res) => {
    // res.send('New USer');
    const player = new Player({
      name: 'edd',
      lastname: 'test',
      email: 'copiloto@copiloto.com'
    });
    player.save((err, NewPlayer) => {
      if (err) {
        const response_data = {
          err: true,
          res: err
        };
        return res.status(400).json(response_data);
      } else {
        const response_data = {
          err: false,
          res: NewPlayer
        };
        return res.status(200).json(response_data);
      }
    });
  }
};
