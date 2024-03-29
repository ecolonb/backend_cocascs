const Player = require('../../../models/Player');
const Session = require('../../../models/Session');
const Area = require('../../../models/Area');
const Confirmation = require('../../../models/Confirmation');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const fetch = require('node-fetch');
const _URL = 'https://cocascs.herokuapp.com';
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
const fnSendEmail = (hashToValidateAcount, typePlayer, name, email) => {
  //Enviar email confirmación.
  var message = undefined;
  try {
    const urlEndPoint =
      _URL + '/activate_acount?target=' + hashToValidateAcount;
    if (typePlayer == 'player') {
      message = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Email CocasCS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          .myButton {
            -moz-box-shadow: 0px 1px 0px 0px #f0f7fa;
            -webkit-box-shadow: 0px 1px 0px 0px #f0f7fa;
            box-shadow: 0px 1px 0px 0px #f0f7fa;
            background: -webkit-gradient(
              linear,
              left top,
              left bottom,
              color-stop(0.05, #33bdef),
              color-stop(1, #019ad2)
            );
            background: -moz-linear-gradient(top, #33bdef 5%, #019ad2 100%);
            background: -webkit-linear-gradient(top, #33bdef 5%, #019ad2 100%);
            background: -o-linear-gradient(top, #33bdef 5%, #019ad2 100%);
            background: -ms-linear-gradient(top, #33bdef 5%, #019ad2 100%);
            background: linear-gradient(to bottom, #33bdef 5%, #019ad2 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#33bdef', endColorstr='#019ad2',GradientType=0);
            background-color: #33bdef;
            -moz-border-radius: 6px;
            -webkit-border-radius: 6px;
            border-radius: 6px;
            border: 1px solid #057fd0;
            display: inline-block;
            cursor: pointer;
            color: #ffffff;
            font-family: Arial;
            font-size: 15px;
            font-weight: bold;
            padding: 6px 55px;
            text-decoration: none;
            text-shadow: 0px -1px 0px #5b6178;
          }
          .myButton:hover {
            background: -webkit-gradient(
              linear,
              left top,
              left bottom,
              color-stop(0.05, #019ad2),
              color-stop(1, #33bdef)
            );
            background: -moz-linear-gradient(top, #019ad2 5%, #33bdef 100%);
            background: -webkit-linear-gradient(top, #019ad2 5%, #33bdef 100%);
            background: -o-linear-gradient(top, #019ad2 5%, #33bdef 100%);
            background: -ms-linear-gradient(top, #019ad2 5%, #33bdef 100%);
            background: linear-gradient(to bottom, #019ad2 5%, #33bdef 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#019ad2', endColorstr='#33bdef',GradientType=0);
            background-color: #019ad2;
          }
          .myButton:active {
            position: relative;
            top: 1px;
          }
        </style>
      </head>
      <body>
        <body style="margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <label
                  style="display: block;width: 100%;  text-align: center;margin-bottom: 10px;margin-top: 20px;font-size: 18px;font-weight:400;"
                  >Bienvenido a Cocas Copiloto Satelital</label
                >
              </td>
            </tr>
            <tr>
              <td>
                <span
                  style="display: block;width: 100%;  text-align: center;margin-bottom: 14px;font-size: 15px;"
                >
                  Hola ${name} estás registrado como participante, recuerda meter
                  muchas cocas y compartir muchos momentos felices.
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <p style="display:inline-block;width:100%; text-align:center;">
                  <a href="${urlEndPoint}" class="myButton">Activar cuenta</a>
                </p>
              </td>
            </tr>
          </table>
        </body>
      </body>
    </html>
    `;
    } else {
      message = `
    <p>Hola ${name} eres un espectador, ¡Tu no metes cocas!</p>
    '<b>Hash to validate: ${hashToValidateAcount}</b>
    `;
    }
  } catch (error_c) {}
  const promiseEmail = new Promise((resolve, reject) => {
    try {
      const _URL = 'http://lab.micopiloto.com/dev5/cocascs/api/SendEmail';
      let dataToSend = {
        name: name,
        email: email,
        mssg: message,
        token_auth: 'llaveWeb2786'
      };
      fetch(_URL, {
        method: 'post',
        body: JSON.stringify(dataToSend),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          //DoSomeThing
          resolve(true);
        })
        .catch(catchErr => {
          resolve(false);
        });
    } catch (error__) {
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
                response_data.chk_email = resultEmail;
                return res.status(200).json(response_data);
              })
              .catch(errPromise => {
                response_data.chk_email = false;
                return res.status(200).json(response_data);
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
