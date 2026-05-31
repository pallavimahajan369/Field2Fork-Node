const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "######",
    database: "field2fork",
  })


module.exports = {
  pool,
};
