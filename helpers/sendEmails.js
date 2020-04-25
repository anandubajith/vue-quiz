require('dotenv').config();
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
// required for rendering the template
const nunjucks = require('nunjucks');
nunjucks.configure('.', { autoescape: true });

const sendMail = (email, variables) => {
  console.log(`Sending email to ${email}`);

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
