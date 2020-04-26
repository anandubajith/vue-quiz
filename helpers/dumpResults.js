require('dotenv').config();
// Setup DB
const { Pool } = require('pg');
const parseDbUrl = require("parse-database-url");
const credentials = parseDbUrl(process.env.DATABASE_URL);
// workaround to connect to heroku
credentials.ssl = { rejectUnauthorized: false}
const pool = new Pool(credentials);


// CSV writing part
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './output.csv',
  header: [
      {id: 'name', title: 'Name'},
      {id: 'phone', title: 'Phone'},
      {id: 'email', title: 'Email'},
      {id: 'created_at', title: 'Created_at'},
      {id: 'member', title: 'IEEE_Member'},
      {id: 'score', title: 'Final_score'},
      {id: 'submitted_at', title: 'Submitted_at'},
  ]
});


//  query pool and return data

pool
    .query(`SELECT name,email,phone,created_at,member,score,submitted_at FROM participants
                            ORDER BY score DESC`)
    .then(res => res.rows)
    .then(rows => csvWriter.writeRecords(rows))
    .then(console.log('Wrote to output.csv'))
    .then(pool.end())
    .catch(err => console.error('Error', err.stack));


