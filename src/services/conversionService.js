const db = require('../db/db')

function checkApproval(productId, creatorId) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT 1 FROM applications 
       WHERE product_id = ? AND creator_id = ? AND status = 'approved'`,
      [productId, creatorId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0);
      }
    );
  });
}


function checkDuplicate(referenceId) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT 1 FROM conversions WHERE reference_id = ?',
      [referenceId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0);
      }
    );
  });
}


function createConversion(data) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO conversions 
      (product_id, creator_id, amount, commission, reference_id) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.productId,
        data.creatorId,
        data.amount,
        data.commission,
        data.referenceId || null,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

module.exports = { checkApproval, checkDuplicate, createConversion }