const { Pool } = require('pg');
require('dotenv').config();
const parseDbUrl = require("parse-database-url");

const pool = new Pool(parseDbUrl(process.env.DATABASE_URL));

module.exports = pool;
