const db = require("../db/db");

function createLedger(creatorId, commission, transactionType, referenceId) {
  
  return new Promise((resolve,reject) => {  db.query(
    `INSERT INTO ledger (creator_id, amount, type, status, reference_id)
   VALUES (?, ?, ?, 'pending', ?)`,
    [creatorId, commission, transactionType, referenceId],

  (err,result) => {
    if(err) {
       reject(err)
    } else {
        if(transactionType === 'credit')
          updatePendingBalance(creatorId, commission)
        resolve()
    }
  }
)
})
}

function updateLedgerStatus(referenceId,status) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE ledger 
       SET status = ? 
       WHERE reference_id = ?`,
      [status,referenceId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}
function updatePendingBalance(creatorId,commission) {
  db.query(
    `INSERT INTO wallets (creator_id, total_earnings, pending_balance)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE
     total_earnings = total_earnings + VALUES(total_earnings),
     pending_balance = pending_balance + VALUES(pending_balance)`,
    [creatorId, commission, commission],
  );
}

function updateAvailableBalance(creatorId, commission) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE wallets 
       SET pending_balance = pending_balance - ?, 
           available_balance = available_balance + ?
       WHERE creator_id = ?`,
      [commission, commission, creatorId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

function getWalletBalance(creatorId) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT available_balance FROM wallets WHERE creator_id = ?',
      [creatorId],
      (err, result) => {
        if (err) return reject(err);

        const balance = result[0]?.available_balance || 0;
        resolve(balance);
      }
    );
  });
}

function deductWalletBalance(creatorId, amount) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE wallets 
       SET available_balance = available_balance - ? 
       WHERE creator_id = ?`,
      [amount, creatorId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

module.exports = { 
  createLedger, 
  updatePendingBalance, 
  updateAvailableBalance, 
  updateLedgerStatus, 
  getWalletBalance,
  deductWalletBalance
};
