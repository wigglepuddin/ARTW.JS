const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ARTW',

});


db.getConnection((err) => {

    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQL');
    }

});


module.exports = db;