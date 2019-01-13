const Player = require('../../../models/Player');
const Session = require('../../../models/Session');
const bcrypt = require('bcrypt');
const _ = require('underscore');
module.exports = {
  newUser: async (req, res) => {
    const formData = req.body;
    // const test = await bcrypt.compareSync(
    //   formData.password,
    //   '$2a$07$5o3Zq8X76N6B0NtrRmptyOhCuMGaflUqTvjYdaATd.aVM83K3fWca'
    // );
    // console.log('bcrypt.compareSync(myPlaintextPassword, hash): => ', test);
    // if (test) {
    //   console.log('Contraseña ok');
    // } else {
    //   console.log('Contraseña Bad');
    // }
    //formData.password = await bcrypt.hashSync(formData.password, 7);
    const playerData = {
      name: formData.name,
      lastname: formData.lastname,
      role: formData.role,
      email: formData.email
    };
    let sessionData = {
      user: formData.user,
      password: formData.password,
      ref_player: undefined
    };
    const player = new Player(playerData);
    player.save((err, NewPlayer) => {
      if (err) {
        const response_data = {
          err: true,
          res: err
        };
        return res.status(400).json(response_data);
      } else {
        sessionData.ref_player = NewPlayer;
        const session = new Session(sessionData);

        session.save((err, NewSession) => {
          if (err) {
            // Aqui eliminar el participante insertado
            const response_data = {
              err: true,
              res: err
            };
            Player.findByIdAndDelete(NewPlayer._id, (err_, playerDeleted) => {
              if (err_) {
                const response_data = {
                  err: false,
                  res: err_
                };
                return res.status(400).json(response_data);
              } else {
                const response_data = {
                  err: false,
                  res: err
                };
                return res.status(200).json(response_data);
              }
            });
          } else {
            const sessionResponse = _.pick(NewSession, ['user', 'created_at']);
            const response_data = {
              err: false,
              res: NewPlayer,
              session: sessionResponse
            };
            //Enviar email confirmación.
            var api_key = '2fc79774891e9697ac90a271e20f9625-060550c6-a3572ca8';
            var domain = 'sandbox112ee495c6c040e8bb243e77b7138c90.mailgun.org';
            var mailgun = require('mailgun-js')({
              apiKey: api_key,
              domain: domain
            });

            var data = {
              from: 'Cocas Copiloto Satelital <ecolon@copiloto.com.mx>',
              to: 'ecolon@copiloto.com.mx',
              subject: 'Hello',
              html: '<b> Test email text </b>'
            };

            mailgun.messages().send(data, function(error, body) {
              if (error) {
                console.log('Error:=>>>>>>>>>>>>>>', error);
              }
              return res.status(200).json(response_data);
            });
          }
        });
      }
    });
  },
  checkUser: (req, res) => {
    //res.send('Checking username: ' + req.params.id);
    // user: new RegExp(req.params.id.trim(), 'i')
    const userToSearch = req.params.user.trim();
    const searcParams = {
      user: userToSearch
    };
    Session.find(searcParams, (err, result) => {
      if (err) {
        const responseData = {
          err_: true,
          user_av: false,
          mssg: err
        };
        return res.status(400).json(responseData);
      } else {
        let resonseData = undefined;
        if (result.length > 0) {
          resonseData = {
            err_: false,
            user_av: false,
            mssg: 'user_not_available'
          };
        } else {
          resonseData = {
            err_: false,
            user_av: true,
            mssg: 'user_available'
          };
        }

        return res.status(200).json(resonseData);
      }
    });
  },
  checkEmail: (req, res) => {
    const emailToSearch = req.params.email.trim();
    console.log('Verificando si el email existe: ', emailToSearch);
    const searchParams = {
      email: emailToSearch
    };
    Player.find(searchParams, (err, result) => {
      if (err) {
        const responseData = {
          err_: true,
          email_av: false,
          mssg: err
        };
        return res.status(400).json(responseData);
      } else {
        if (result.length > 0) {
          const responseData = {
            err_: false,
            email_av: false,
            mssg: 'email_not_available'
          };
          return res.status(200).json(responseData);
        } else {
          const responseData = {
            err_: false,
            email_av: true,
            mssg: 'email_available'
          };
          return res.status(200).json(responseData);
        }
      }
    });
  }
};
