const mysql = require("mysql2/promise");
const DBhost = require("./secret.js").DBhost;
const DBpassword = require("./secret.js").DBpassword;
const database = require("./secret.js").database;
const dbPort = require("./secret.js").dbPort;

const pool = mysql.createPool({
  host: DBhost,
  user: "park",
  port: dbPort,
  password: DBpassword,
  database: database,
});

module.exports = {
  pool: pool,
};
