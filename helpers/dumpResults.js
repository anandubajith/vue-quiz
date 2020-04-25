const { Pool } = require('pg');
require('dotenv').config();
const parseDbUrl = require("parse-database-url");

const pool = new Pool(parseDbUrl(process.env.DATABASE_URL));


//  query pool and return data

pool.query('SELECT * FROM  participants ORDER BY score DESC',
(error, results) => {
  if (error) {
    return console.log(error);
  }
  return console.log(results.rows);
});
