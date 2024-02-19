const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mithun@12',
    database: 'devtest1'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

module.exports = db;
