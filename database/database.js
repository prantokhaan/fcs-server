const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12676206",
  password: "ShgtBh8MFl",
  database: "sql12676206",
});

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "football_competition_simulator"
// });

console.log("Database Connected");

module.exports = db;