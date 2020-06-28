const jwt = require('jsonwebtoken');
const express = require('express');
const { check, validationResult } = require('express-validator');
const fetch = require("node-fetch");
require('dotenv').config();
const db = require('./db');
const { isAuth } = require('./middlewares');

const questions = require('./questions.json');
const { response } = require('express');

const normalize = (str) => {
  if (str == null) {
    return '';
  }
  return str.toLowerCase().replace(' ', '');
};


const router = express.Router();

router.post('/register', [
  check('name').isString(),
  check('email').isEmail().normalizeEmail(),
  check('phone').isLength({ min: 9, max: 13 }),
  // check('token').isString(),
  check('member').isBoolean()
], async (req, res) => {
  // validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {

    // check the recaptchav3 token
    // TODO: THis is taking too long
    // const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_KEY}&response=${req.body.token}`;
    // let verifyRequest = await fetch(verifyUrl, { method: 'POST' });
    // let verifyResponse = await verifyRequest.json();
    // console.log(verifyResponse);
    // if ( !verifyResponse.success) {
    //   throw new Error('Invalid captcha');
    // }

    // store the details in DB
    await db.query('INSERT INTO participants(name,email,phone,member,created_at, spam_score) VALUES($1, $2, $3, $4,NOW(), $5)',
      [req.body.name, req.body.email, req.body.phone, req.body.member, 1]);

    // generate a token with 6min expiry and send it
    const data = {
      name: req.body.name,
      email: req.body.email
    };
    const expiration = '12min';
    const token = jwt.sign(data, process.env.SECRET, { expiresIn: expiration });
    // do shuffling of questions, options
    res.json({ questions: questions.questions, token });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).send('already registered');
    }
    console.log(error);
    return res.status(500).send('error occoured');
  }
});

router.post('/submit', isAuth, (req, res) => {
  // validate the submission

  // would need to handle bad data
  const count = Object.keys(req.body).reduce((c, key) => (normalize(questions.answers[key]) === normalize(req.body[key]) ? c + 1 : c), 0);

  console.log(req.token.email, req.body);

  // store submission+score in db
  db.query('UPDATE participants SET response=$1,score=$2,submitted_at=NOW() WHERE email=$3',
    [JSON.stringify(req.body), count, req.token.email],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error occoured');
      }
      res.status(200).send({ message: 'Success' });
    });
});

router.get('/stats', async (req, res) => {
  try {
    const totalParticipants = await (await db.query('SELECT COUNT(*) FROM participants;')).rows[0].count;
    const totalSubmissions = await (await db.query('SELECT COUNT(*) FROM participants WHERE score IS NOT NULL;')).rows[0].count;
    const ieeeMembers = await (await db.query('SELECT COUNT(*) FROM participants WHERE member=true;')).rows[0].count;
    const highestScore = await (await db.query('SELECT MAX(score) FROM participants WHERE score IS NOT NULL')).rows[0].max;

    return res.json({
      totalParticipants ,totalSubmissions,ieeeMembers,highestScore
    });

  } catch (e) {
    console.error(e);
    return res.status(500).send('error occoured');
  }
})

module.exports = router;
