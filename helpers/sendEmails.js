require('dotenv').config();
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
// required for rendering the template
const nunjucks = require('nunjucks');
nunjucks.configure('.', { autoescape: true });
// required for reading the output.csv and sending emails
const csv = require('csv-parser');
const fs = require('fs');


const sendMail = (email, variables) => {
  var data = {
    from: 'IAS IEEE <noreply@email.nitcieee.tech>',
    to: email,
    subject: 'NIT-C IEEE | Corona Quiz | result+answers',
    html: nunjucks.render('template.html', { correctCount: variables.correctCount })
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(`Email sent to ${email}`)
  });
}

fs.createReadStream('output.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(`Sending email to ${row["Email"]} with score ${row["Final_score"]}`);
    if ( row["Final_score"] !== "" ) {
        sendMail(row["Email"], { correctCount: row["Final_score"] });
    }
  })
  .on('end', () => {
      console.log('Successsfully Completed')
  });
