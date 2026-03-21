const db = require('../db/db');

function createUser(email, hashed, role) {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashed, role],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}
module.exports = { createUser, findUserByEmail };