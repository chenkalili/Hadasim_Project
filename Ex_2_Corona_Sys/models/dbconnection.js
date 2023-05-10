const mysql = require('mysql');

const dbconnection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "db"
});

module.exports = dbconnection;
