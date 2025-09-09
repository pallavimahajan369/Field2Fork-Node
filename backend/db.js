const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123Pass@",
    database: "field2fork",
  })
  // .promise(); // ✨ This enables async/await with .query()

module.exports = {
  pool,
};
