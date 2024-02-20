const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: '-f23H16he5D2a3h25A4chaG4AfdbB2dc',
    database: 'railway',
    port: '54579',
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

module.exports = db;
