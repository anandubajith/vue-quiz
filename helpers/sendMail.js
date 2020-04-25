const api_key = 'key-64c28ab14a500adb8fec86ffa0a01354';
const domain = 'email.nitcieee.tech';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const nunjucks = require('nunjucks');

nunjucks.configure('.', { autoescape: true });

const sendMail = (email, variables) => {
  console.log('Sending Email');

  var data = {
    from: 'IAS IEEE <noreply@email.nitcieee.tech>',
    to: email,
    subject: 'NIT-C IEEE | Corona Quiz | result+answers',
    html: nunjucks.render('template.html', { correctCount: variables.correctCount })
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

}

module.exports = sendMail;