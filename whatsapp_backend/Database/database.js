const mysql = require('mysql');

db_code = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'whatsappp_clone'
}

// db_code = {
//     host     : 'arifmaniyar0@localhost',
//     user     : 'arifmaniyar0',
//     password : '498urre98fu49ut93urewie09rwi',
//     database : 'whatsappp_clone'
// }

const connection = mysql.createConnection(db_code);

connection.connect();


module.exports = connection;