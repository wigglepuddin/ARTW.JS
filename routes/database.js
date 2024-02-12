const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6683442',
    password: 'UjIAP5nZas',
    database: 'sql6683442',

});


db.connect((err) => {

    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQL');
    }

});


module.exports = db;
