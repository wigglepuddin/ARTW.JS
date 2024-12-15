const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6683442',
    password: 'UjIAP5nZas',
    database: 'ql6683442',

});


db.getConnection((err) => {

    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQL');
    }

});


module.exports = db;
