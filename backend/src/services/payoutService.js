const db = require('../db/db')

function createPayout(creatorId, amount) {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO payouts (creator_id, amount, status) VALUES (?, ?, "pending")',
      [creatorId, amount],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
}


module.exports = {createPayout}