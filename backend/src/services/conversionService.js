const db = require('../db/db')
const {createLedger} = require('./ledgerService')

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
        else {
            createLedger(data.creatorId,data.commission,'credit', data.referenceId)
            resolve()
        }
      }
    );
  });
}

function getConversionById(id) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT creator_id, commission FROM conversions WHERE id = ?',
      [id],
      (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          return reject(new Error("Conversion not found"));
        }

        resolve(result[0]);
      }
    );
  });
}

function getAllPendingConversions() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT c.*
       FROM conversions c
       JOIN ledger l 
         ON l.reference_id = c.reference_id AND l.type = 'credit'
       WHERE l.status = 'pending'`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

module.exports = { checkApproval, checkDuplicate, createConversion, getConversionById , getAllPendingConversions}