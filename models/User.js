const db = require('../db');

class User {
    static async createUser(username, password) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(sql, [username, password], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.query(sql, [username], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

}

module.exports = User;
