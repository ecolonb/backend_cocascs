const Player = require('../../../models/Player');
const Session = require('../../../models/Session');
const Area = require('../../../models/Area');
const Confirmation = require('../../../models/Confirmation');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// Funciones del modulo
const fnSetConfirmationOerder = async id => {
  const player = await Player.findById(id);
  const hashToValidate = await bcrypt.hashSync(String(id), 7);
  const confirmationOrder = {
    player: player,
    hash: hashToValidate
  };
  const confirmation = new Confirmation(confirmationOrder);
  await confirmation.save();
  return hashToValidate;
};
const fnSendEmail = async (hashToValidateAcount, typePlayer, name, email) => {
  //Enviar email confirmación.
  const api_key = '2fc79774891e9697ac90a271e20f9625-060550c6-a3572ca8';
  const domain = 'sandbox112ee495c6c040e8bb243e77b7138c90.mailgun.org';
  const _URL = 'https://cocascs.herokuapp.com/api';
  const mailgun = require('mailgun-js')({
    apiKey: api_key,
    domain: domain
  });
  let message = undefined;
  const urlEndPoint = _URL + '/activate_acount?target=' + hashToValidateAcount;
  console.log('urlEndPoint', urlEndPoint);
  if (typePlayer == 'player') {
    message = `
    <p>Hola ${name} eres un participante, recuerda meter muchas cocas!</p>
    <b>Hash to validate: ${hashToValidateAcount}</b>
    <p> click to activate </br>
    <a href="${urlEndPoint}">Activar cuenta</a>
    </p>
    `;
  } else {
    message = `
    <p>Hola ${name} eres un espectador, ¡Tu no metes cocas!</p>
    '<b>Hash to validate: ${hashToValidateAcount}</b>
    `;
  }

  var data = {
    from: 'Cocas Copiloto Satelital <ecolon@copiloto.com.mx>',
    to: name + ' <' + email + '>',
    subject: 'Activación de cuenta Cocas Cs',
    html: message
  };

  const promiseEmail = new Promise(async (resolve, reject) => {
    try {
      await mailgun.messages().send(data, function(error, body) {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      resolve(false);
    }
  });
  return promiseEmail;
};
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
      email: formData.email,
      ref_area: formData.area
    };

    const player = new Player(playerData);
    player.save(async (err, NewPlayer) => {
      if (err) {
        const response_data = {
          err: true,
          res: err
        };
        return res.status(400).json(response_data);
      } else {
        let sessionData = {
          user: formData.user,
          password: formData.password,
          ref_player: undefined
        };
        // Si el participante se creo correctamente se intenta guardar la session
        sessionData.ref_player = NewPlayer;
        const session = new Session(sessionData);

        session.save(async (err, NewSession) => {
          if (err) {
            // Aqui eliminar el participante insertado
            const response_data = {
              err: true,
              res: err
            };
            Player.findByIdAndDelete(async (err_, playerDeleted) => {
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
                return res.status(400).json(response_data);
              }
            });
          } else {
            // Obteniendo unicamente los datos que se enviaram de respuesta
            const sessionResponse = _.pick(NewSession, ['user', 'created_at']);

            //Agregar uuario a Area
            const area = await Area.findById(formData.area);
            area.ref_player.push(NewPlayer);
            await area.save();
            // Set confitmation data
            const hashToValidateAcount = await fnSetConfirmationOerder(
              NewPlayer._id
            );
            let response_data = {
              err: false,
              res: NewPlayer,
              session: sessionResponse,
              chk_email: undefined
            };
            fnSendEmail(
              hashToValidateAcount,
              NewPlayer.role,
              NewPlayer.name + ' ' + NewPlayer.lastname,
              NewPlayer.email
            )
              .then(resultEmail => {
                console.log('resSendEmail==========>>>>>: ', resultEmail);
                response_data.chk_email = resultEmail;
                console.log('response_data========>>>>', response_data);
                return res.status(200).json(response_data);
              })
              .catch(errPromise => {
                response_data.chk_email = false;
                console.log('response_data========>>>>', response_data);
                return res.status(200).json(response_data);
                console.log('errPromise: ', errPromise);
              });

            // //Enviar email confirmación.
            // var api_key = '2fc79774891e9697ac90a271e20f9625-060550c6-a3572ca8';
            // var domain = 'sandbox112ee495c6c040e8bb243e77b7138c90.mailgun.org';
            // var mailgun = require('mailgun-js')({
            //   apiKey: api_key,
            //   domain: domain
            // });
            // var data = {
            //   from: 'Cocas Copiloto Satelital <ecolon@copiloto.com.mx>',
            //   to:
            //     formData.name +
            //     ' ' +
            //     formData.lastname +
            //     ' <' +
            //     formData.email +
            //     '>',
            //   subject: 'Activación de cuenta Cocas Cs',
            //   html: '<b> HAsh to validate:' + hashToValidateAcount + '</b>'
            // };

            // mailgun.messages().send(data, function(error, body) {
            //   if (error) {
            //     console.log('Error:=>>>>>>>>>>>>>>', error);
            //   }
            //   return res.status(200).json(response_data);
            // });
          }
        });
      }
    });
  },
  // *************** Function to validate USER ****************
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
  // *************** Function to validate EMAIL ****************
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
