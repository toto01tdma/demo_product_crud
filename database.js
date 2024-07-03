require('dotenv').config()
const mysql = require("mysql");

const {USER, PASS, HOST, PORT, DATABASE } = process.env;

const dbConnection = mysql.createConnection({
    host     : HOST, // MYSQL HOST NAME
    user     : USER, // MYSQL USERNAME
    password : PASS, // MYSQL PASSWORD
    database : DATABASE // MYSQL DB NAME
}).promise();

dbConnection.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

module.exports = dbConnection;