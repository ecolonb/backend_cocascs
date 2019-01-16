const fnSendEmail = async (hashToValidateAcount, typePlayer, name, email) => {
  //Enviar email confirmación.
  const api_key = '2fc79774891e9697ac90a271e20f9625-060550c6-a3572ca8';
  const domain = 'sandbox112ee495c6c040e8bb243e77b7138c90.mailgun.org';
  const _URL = 'https://cocascs.herokuapp.com';
  const mailgun = require('mailgun-js')({
    apiKey: api_key,
    domain: domain
  });
  let message = undefined;
  const urlEndPoint = _URL + '/activate_acount?target=' + hashToValidateAcount;
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
                  style="display: block;width: 100%;  text-align: center;margin-bottom: 10px;margin-top: 20px;font-size: 18px;"
                  >Bienvenido a Cocas Copiloto Satelital</label
                >
              </td>
            </tr>
            <tr>
              <td>
                <span
                  style="display: block;width: 100%;  text-align: center;margin-bottom: 14px;font-size: 18px;"
                >
                  Hola ${name} estás registrado como participante, recuerda meter
                  muchas cocas y comparpirt muchos momentos felices!!
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
